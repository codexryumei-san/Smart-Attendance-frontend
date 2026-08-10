import { useState, useRef, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const UNLOCK_SCAN_INTERVAL_MS = 1500; // how often we probe for a course rep face
const ATTENDANCE_SCAN_INTERVAL_MS = 1500;
const IT_COURSE_NAME = "Information Technology";
const COURSES = ["Information Technology", "Mobile Computing", "Information Systems"];
const IT_GROUPS = ["A", "B", "C", "D", "E", "F"];

const MODES = {
  LOCKED: "LOCKED",
  SETUP: "SETUP",
  ACTIVE: "ACTIVE",
};

// ---------------------------------------------------------------------------
// Small helper: capture a single frame from a <video> element as base64 JPEG
// ---------------------------------------------------------------------------
function captureFrame(videoEl) {
  if (!videoEl || videoEl.readyState < 2) return null;
  const canvas = document.createElement("canvas");
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  // Strip the "data:image/jpeg;base64," prefix - backend expects raw base64
  return canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
}

export default function Kiosk() {
  const [mode, setMode] = useState(MODES.LOCKED);
  const [courseRep, setCourseRep] = useState(null); // { id, name, index_number, group_name }
  const [activeSession, setActiveSession] = useState(null);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [setupError, setSetupError] = useState("");
  const [setupLoading, setSetupLoading] = useState(false);

  const [lockedStatus, setLockedStatus] = useState(""); // "" | "scanning" | "unauthorized"
  const [scanMessage, setScanMessage] = useState(null); // { type: 'success'|'error', text }

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanTimerRef = useRef(null);
  const busyRef = useRef(false); // prevents overlapping requests

  // -------------------------------------------------------------------------
  // Webcam lifecycle - runs in LOCKED and ACTIVE modes, off in SETUP
  // -------------------------------------------------------------------------
  const webcamNeeded = mode === MODES.LOCKED || mode === MODES.ACTIVE;

  useEffect(() => {
    let cancelled = false;

    async function startWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setScanMessage({ type: "error", text: "Unable to access the webcam." });
      }
    }

    function stopWebcam() {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    }

    if (webcamNeeded) {
      startWebcam();
    } else {
      stopWebcam();
    }

    return () => {
      cancelled = true;
      stopWebcam();
    };
  }, [webcamNeeded]);

  // -------------------------------------------------------------------------
  // LOCKED mode: poll /api/kiosk/unlock
  // -------------------------------------------------------------------------
  const pollUnlock = useCallback(async () => {
    if (busyRef.current) return;
    const frame = captureFrame(videoRef.current);
    if (!frame) return;

    busyRef.current = true;
    setLockedStatus("scanning");
    try {
      const res = await fetch(`${API_BASE}/api/kiosk/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: frame }),
      });
      const data = await res.json();

      if (data.status === "success" && data.rep) {
        setCourseRep(data.rep);
        setMode(MODES.SETUP);
        setLockedStatus("");
      } else if (data.status === "unauthorized") {
        setLockedStatus("unauthorized");
      } else {
        // no_face_detected / multiple_faces_detected / spoof_detected / etc.
        setLockedStatus("");
      }
    } catch (err) {
      console.error("Unlock poll failed:", err);
    } finally {
      busyRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (mode !== MODES.LOCKED) return;
    scanTimerRef.current = setInterval(pollUnlock, UNLOCK_SCAN_INTERVAL_MS);
    return () => clearInterval(scanTimerRef.current);
  }, [mode, pollUnlock]);

  // -------------------------------------------------------------------------
  // ACTIVE mode: poll /api/recognize
  // -------------------------------------------------------------------------
  const pollAttendance = useCallback(async () => {
    if (busyRef.current) return;
    const frame = captureFrame(videoRef.current);
    if (!frame) return;

    busyRef.current = true;
    try {
      const res = await fetch(`${API_BASE}/api/recognize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: frame }),
      });
      const data = await res.json();

      if (data.status === "success") {
        setScanMessage({ type: "success", text: `Attendance Logged: ${data.student_name}` });
      } else if (data.status === "duplicate") {
        setScanMessage({ type: "info", text: `${data.student_name} already logged` });
      } else if (data.status === "no_active_session") {
        // Session expired server-side (>4h) - drop back to LOCKED
        setMode(MODES.LOCKED);
        setActiveSession(null);
        setCourseRep(null);
      } else if (data.status === "no_match") {
        setScanMessage({ type: "error", text: "Face not recognized" });
      }
      // no_face_detected / multiple_faces_detected are silently ignored
      // so the kiosk doesn't flash messages between scans

      if (data.status && data.status !== "no_face_detected") {
        setTimeout(() => setScanMessage(null), 3000);
      }
    } catch (err) {
      console.error("Recognition poll failed:", err);
    } finally {
      busyRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (mode !== MODES.ACTIVE) return;
    scanTimerRef.current = setInterval(pollAttendance, ATTENDANCE_SCAN_INTERVAL_MS);
    return () => clearInterval(scanTimerRef.current);
  }, [mode, pollAttendance]);

  // -------------------------------------------------------------------------
  // SETUP mode: start the session
  // -------------------------------------------------------------------------
  const requiresGroup = selectedCourse === IT_COURSE_NAME;

  async function handleStartSession() {
    setSetupError("");

    if (!selectedCourse) {
      setSetupError("Please select a course.");
      return;
    }
    if (requiresGroup && !selectedGroup) {
      setSetupError("Please select a group.");
      return;
    }

    setSetupLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/sessions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_name: selectedCourse,
          student_group: requiresGroup ? selectedGroup : null,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSetupError(data.error || "Failed to start session.");
        return;
      }

      setActiveSession(data.session);
      setMode(MODES.ACTIVE);
    } catch (err) {
      console.error("Start session failed:", err);
      setSetupError("Could not reach the server. Is the backend running?");
    } finally {
      setSetupLoading(false);
    }
  }

  function handleCancelSetup() {
    setSelectedCourse("");
    setSelectedGroup("");
    setSetupError("");
    setCourseRep(null);
    setMode(MODES.LOCKED);
  }

  // -------------------------------------------------------------------------
  // ACTIVE mode: close session early
  // -------------------------------------------------------------------------
  async function handleCloseSessionEarly() {
    try {
      await fetch(`${API_BASE}/api/sessions/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: activeSession?.id }),
      });
    } catch (err) {
      console.error("Close session failed:", err);
    } finally {
      setActiveSession(null);
      setCourseRep(null);
      setSelectedCourse("");
      setSelectedGroup("");
      setMode(MODES.LOCKED);
    }
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      {mode === MODES.LOCKED && (
        <LockedView videoRef={videoRef} status={lockedStatus} />
      )}

      {mode === MODES.SETUP && (
        <SetupView
          courseRep={courseRep}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          requiresGroup={requiresGroup}
          error={setupError}
          loading={setupLoading}
          onStart={handleStartSession}
          onCancel={handleCancelSetup}
        />
      )}

      {mode === MODES.ACTIVE && (
        <ActiveView
          videoRef={videoRef}
          session={activeSession}
          scanMessage={scanMessage}
          onCloseEarly={handleCloseSessionEarly}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LOCKED
// ---------------------------------------------------------------------------
function LockedView({ videoRef, status }) {
  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      <div className="flex items-center gap-3 text-slate-400">
        <LockIcon />
        <span className="uppercase tracking-widest text-sm">Kiosk Locked</span>
      </div>

      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover -scale-x-100"
        />
        <div className="absolute inset-0 border-4 border-slate-700/50 rounded-2xl pointer-events-none" />
      </div>

      <p className="text-center text-slate-400 max-w-md">
        {status === "unauthorized"
          ? "Face detected but not recognized as a Course Representative."
          : "Course Representative: look at the camera to unlock session setup."}
      </p>

      {status === "unauthorized" && (
        <div className="px-4 py-2 rounded-lg bg-amber-950 text-amber-300 border border-amber-800 text-sm">
          Unauthorized
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SETUP
// ---------------------------------------------------------------------------
function SetupView({
  courseRep,
  selectedCourse,
  setSelectedCourse,
  selectedGroup,
  setSelectedGroup,
  requiresGroup,
  error,
  loading,
  onStart,
  onCancel,
}) {
  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col gap-5">
      <div>
        <p className="text-sm text-slate-400">Welcome,</p>
        <h1 className="text-2xl font-semibold">{courseRep?.name ?? "Course Rep"}</h1>
        {courseRep?.index_number && (
          <p className="text-sm text-slate-500">{courseRep.index_number}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-slate-400">Course</label>
        <select
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            setSelectedGroup(""); // reset group whenever the course changes
          }}
        >
          <option value="">Select a course...</option>
          {COURSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {requiresGroup && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-slate-400">Group</label>
          <select
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">Select a group...</option>
            {IT_GROUPS.map((g) => (
              <option key={g} value={g}>
                Group {g}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-400 bg-red-950 border border-red-900 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex gap-3 mt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
        >
          Cancel
        </button>
        <button
          onClick={onStart}
          disabled={loading}
          className="flex-1 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-sky-900 disabled:text-slate-500 font-medium transition"
        >
          {loading ? "Starting..." : "Start Session"}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ACTIVE
// ---------------------------------------------------------------------------
function ActiveView({ videoRef, session, scanMessage, onCloseEarly }) {
  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full">
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-400">Session Active</p>
          <h2 className="text-xl font-semibold">
            {session?.course_name}
            {session?.group_name ? ` · Group ${session.group_name}` : ""}
          </h2>
        </div>
        <button
          onClick={onCloseEarly}
          className="px-4 py-2 rounded-lg border border-red-800 text-red-400 hover:bg-red-950 transition text-sm"
        >
          Close Session Early
        </button>
      </div>

      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover -scale-x-100"
        />

        {scanMessage && (
          <div
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full font-medium text-sm shadow-lg ${
              scanMessage.type === "success"
                ? "bg-emerald-600 text-white"
                : scanMessage.type === "info"
                ? "bg-slate-700 text-slate-200"
                : "bg-red-600 text-white"
            }`}
          >
            {scanMessage.text}
          </div>
        )}
      </div>

      <p className="text-slate-500 text-sm">Students: present your face to log attendance.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
