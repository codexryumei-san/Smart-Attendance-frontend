import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import api from "../api";

export default function KioskMode() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Kiosk Mode (Webcam Scanner)</h1>
      <p>Webcam interface for student attendance scanning.</p>
    </div>
  );
}

export default function KioskMode() {
  const [courses, setCourses] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [scannerStatus, setScannerStatus] = useState("Initializing Camera...");
  const webcamRef = useRef(null);
  const recognitionIntervalRef = useRef(null);

  useEffect(() => {
    fetchCourses();
    checkActiveSession();
    
    // Poll for active session status every 30 seconds
    const interval = setInterval(checkActiveSession, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeSession && activeSession.time_remaining) {
      setTimeRemaining(activeSession.time_remaining * 3600); // Convert to seconds
      
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            checkActiveSession(); // Check if session expired
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [activeSession]);

  useEffect(() => {
    if (activeSession) {
      setScannerStatus("Initializing Camera...");
      // Start recognition loop every 1.5 seconds
      recognitionIntervalRef.current = setInterval(captureAndRecognize, 1500);
    } else {
      // Clear recognition interval when session is not active
      if (recognitionIntervalRef.current) {
        clearInterval(recognitionIntervalRef.current);
        recognitionIntervalRef.current = null;
      }
      setRecognitionResult(null);
      setScannerStatus("Session Inactive");
    }
    
    return () => {
      if (recognitionIntervalRef.current) {
        clearInterval(recognitionIntervalRef.current);
      }
    };
  }, [activeSession]);

  async function fetchCourses() {
    try {
      const data = await api.getCourses();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError("Failed to load courses. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }

  async function checkActiveSession() {
    try {
      const data = await api.getActiveSession();
      setActiveSession(data.session);
      setError(null);
    } catch (err) {
      console.error("Failed to check active session:", err);
    }
  }

  async function startSession(groupCourseId) {
    try {
      const data = await api.startSession({ group_course_id: groupCourseId });
      setActiveSession(data.session);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to start session");
    }
  }

  async function closeSession() {
    try {
      await api.closeSession({ session_id: activeSession?.id });
      setActiveSession(null);
      setTimeRemaining(0);
      setError(null);
      setRecognitionResult(null);
    } catch (err) {
      setError(err.message || "Failed to close session");
    }
  }

  async function captureAndRecognize() {
    console.log("[Recognition] Starting capture cycle...");
    
    // Check if webcam is available
    if (!webcamRef.current) {
      console.error("[Recognition] Webcam reference is null");
      setScannerStatus("Camera Error: No webcam reference");
      return;
    }
    
    try {
      setScannerStatus("Capturing frame...");
      console.log("[Recognition] Attempting to capture frame...");
      
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (!imageSrc) {
        console.error("[Recognition] getScreenshot() returned null");
        setScannerStatus("Camera Error: Failed to capture frame");
        return;
      }
      
      console.log("[Recognition] Frame captured successfully, size:", imageSrc.length);
      setScannerStatus("Scanning...");
      
      const result = await api.recognizeFace({ image: imageSrc });
      
      console.log("[Recognition] API response received:", result);
      setRecognitionResult(result);
      
      // Update scanner status based on result
      if (result.status === "success") {
        setScannerStatus(`Match: ${result.student_name}`);
      } else if (result.status === "duplicate") {
        setScannerStatus(`Already Logged: ${result.student_name}`);
      } else if (result.status === "spoof_detected") {
        setScannerStatus("Spoof Detected");
      } else if (result.status === "no_face_detected") {
        setScannerStatus("No Face Detected");
      } else if (result.status === "multiple_faces_detected") {
        setScannerStatus("Multiple Faces");
      } else if (result.status === "no_match") {
        setScannerStatus("No Match Found");
      } else if (result.status === "no_active_session") {
        setScannerStatus("Session Expired");
      } else if (result.status === "error") {
        setScannerStatus(`Server Error: ${result.message}`);
      } else {
        setScannerStatus("Scanning...");
      }
      
    } catch (err) {
      console.error("[Recognition] Error during recognition:", err);
      setScannerStatus(`Error: ${err.message}`);
      // Don't set error state for recognition failures, just log them
    }
  }

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent mx-auto"></div>
          <p className="text-white">Loading Kiosk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Attendance Kiosk</h1>
            <p className="text-sm text-slate-400">Classroom Session Management</p>
          </div>
          {activeSession && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-400">Session Time Remaining</p>
                <p className="text-2xl font-mono font-bold text-green-400">
                  {formatTime(timeRemaining)}
                </p>
              </div>
              <button
                onClick={closeSession}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Close Session
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-red-200">
            {error}
          </div>
        )}

        {!activeSession ? (
          /* Course Selection View */
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-white">
                Select a Course to Start Attendance
              </h2>
              <p className="mt-2 text-slate-400">
                Choose the course for this session. Only one session can be active at a time.
              </p>
            </div>

            {courses.length === 0 ? (
              <div className="rounded-xl border border-slate-700 bg-slate-800 p-12 text-center">
                <p className="text-lg font-medium text-slate-300">No courses available</p>
                <p className="mt-2 text-sm text-slate-500">
                  Please contact your administrator to set up courses.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => startSession(course.id)}
                    className="rounded-xl border border-slate-700 bg-slate-800 p-6 text-left transition-all hover:border-indigo-500 hover:bg-slate-750 hover:shadow-lg hover:shadow-indigo-500/20"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <span className="rounded-full bg-indigo-500/20 px-2 py-1 text-xs font-medium text-indigo-400">
                        {course.course_code}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {course.course_name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">{course.group_name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Active Session View */
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 rounded-xl border border-green-500/50 bg-green-500/10 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-400">Active Session</p>
                  <p className="text-lg font-semibold text-white">
                    {activeSession.course_name} ({activeSession.course_code})
                  </p>
                  <p className="text-sm text-slate-400">{activeSession.group_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-green-400">Live</span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Webcam View */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-white">
                  Live Attendance Scanner
                </h3>
                <div className="aspect-video overflow-hidden rounded-xl border-2 border-slate-700 bg-slate-800">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="h-full w-full object-cover"
                  />
                </div>
                
                {/* Scanner Status Badge */}
                <div className="mt-3 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        scannerStatus.includes("Error") ? "bg-red-500" :
                        scannerStatus.includes("Match") ? "bg-green-500" :
                        scannerStatus.includes("Already") ? "bg-yellow-500" :
                        scannerStatus.includes("Spoof") ? "bg-red-500" :
                        scannerStatus.includes("No Face") ? "bg-slate-500" :
                        scannerStatus.includes("Multiple") ? "bg-orange-500" :
                        scannerStatus.includes("No Match") ? "bg-blue-500" :
                        scannerStatus.includes("Session") ? "bg-purple-500" :
                        "bg-indigo-500"
                      } ${scannerStatus === "Scanning..." ? "animate-pulse" : ""}`}></div>
                      <span className="text-sm font-medium text-slate-300">Scanner Status:</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{scannerStatus}</span>
                  </div>
                </div>
                
                {/* Recognition Status Display */}
                {recognitionResult && (
                  <div className="mt-3 rounded-lg border p-4">
                    {recognitionResult.status === "success" && (
                      <div className="flex items-center gap-3 border border-green-500/50 bg-green-500/10 px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-green-400">Recognized: {recognitionResult.student_name}</p>
                          <p className="text-sm text-green-300">Attendance recorded successfully</p>
                        </div>
                      </div>
                    )}
                    {recognitionResult.status === "duplicate" && (
                      <div className="flex items-center gap-3 border border-yellow-500/50 bg-yellow-500/10 px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500">
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-yellow-400">Already Logged: {recognitionResult.student_name}</p>
                          <p className="text-sm text-yellow-300">Attendance already recorded for this session</p>
                        </div>
                      </div>
                    )}
                    {recognitionResult.status === "spoof_detected" && (
                      <div className="flex items-center gap-3 border border-red-500/50 bg-red-500/10 px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-red-400">Spoof Detected</p>
                          <p className="text-sm text-red-300">{recognitionResult.message || "Please ensure you are facing the camera properly"}</p>
                        </div>
                      </div>
                    )}
                    {recognitionResult.status === "no_face_detected" && (
                      <div className="flex items-center gap-3 border border-slate-500/50 bg-slate-500/10 px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-500">
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-slate-400">No Face Detected</p>
                          <p className="text-sm text-slate-300">Please position your face in the camera view</p>
                        </div>
                      </div>
                    )}
                    {recognitionResult.status === "multiple_faces_detected" && (
                      <div className="flex items-center gap-3 border border-orange-500/50 bg-orange-500/10 px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-orange-400">Multiple Faces Detected</p>
                          <p className="text-sm text-orange-300">Only one person should be in the camera view</p>
                        </div>
                      </div>
                    )}
                    {recognitionResult.status === "no_match" && (
                      <div className="flex items-center gap-3 border border-blue-500/50 bg-blue-500/10 px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-blue-400">No Match Found</p>
                          <p className="text-sm text-blue-300">Face not recognized in this session's group</p>
                        </div>
                      </div>
                    )}
                    {recognitionResult.status === "no_active_session" && (
                      <div className="flex items-center gap-3 border border-purple-500/50 bg-purple-500/10 px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500">
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-purple-400">Session Expired</p>
                          <p className="text-sm text-purple-300">Please start a new session</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-3 rounded-lg border border-slate-700 bg-slate-800 p-4">
                  <p className="text-sm text-slate-400">
                    Position your face in front of the camera for automatic attendance recording.
                    The system will detect and recognize your face.
                  </p>
                </div>
              </div>

              {/* Session Info */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-white">
                  Session Information
                </h3>
                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                    <p className="text-sm text-slate-400">Course</p>
                    <p className="text-lg font-medium text-white">
                      {activeSession.course_name}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                    <p className="text-sm text-slate-400">Course Code</p>
                    <p className="text-lg font-medium text-white">
                      {activeSession.course_code}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                    <p className="text-sm text-slate-400">Group</p>
                    <p className="text-lg font-medium text-white">
                      {activeSession.group_name}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                    <p className="text-sm text-slate-400">Session Started</p>
                    <p className="text-lg font-medium text-white">
                      {new Date(activeSession.opened_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
                    <p className="text-sm text-green-400">Time Remaining</p>
                    <p className="text-3xl font-mono font-bold text-green-400">
                      {formatTime(timeRemaining)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
