import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

export default function KioskMode() {
  const webcamRef = useRef(null);
  
  // App States
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null); 
  
  // New States for Course Rep Flow
  const [activeSession, setActiveSession] = useState(null); // Holds the session details when open
  const [isRepSetupMode, setIsRepSetupMode] = useState(false); // Controls the setup panel visibility
  const [repDetails, setRepDetails] = useState(null); // Holds the Rep's info after they scan in
  
  // Session Form State
  const [sessionForm, setSessionForm] = useState({ course: "", level: "" });

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "user"
  };

  const handleFormChange = (e) => {
    setSessionForm({ ...sessionForm, [e.target.name]: e.target.value });
  };

  // Step 2: The Course Rep Opens the Session
  const handleStartSession = (e) => {
    e.preventDefault();
    setActiveSession({
      course: sessionForm.course,
      level: sessionForm.level,
      programme: repDetails.programme,
      group: repDetails.group,
      repName: repDetails.name
    });
    setIsRepSetupMode(false);
    setScanResult({
      status: 'success',
      message: 'Session Opened Successfully!',
      studentName: `${sessionForm.course} - Group ${repDetails.group}`
    });
    setTimeout(() => setScanResult(null), 3000);
  };

  // Step 3: Closing the Session (Rep or Admin)
  const handleEndSession = () => {
    if(window.confirm("Are you sure you want to close this attendance session?")) {
      setActiveSession(null);
      setRepDetails(null);
      setSessionForm({ course: "", level: "" });
    }
  };

  // Step 1: The Core Scanning Logic (Upgraded for FR-10 Liveness)
  const captureAndVerify = useCallback(async () => {
    if (!webcamRef.current) return;

    setIsScanning(true);
    setScanResult(null);

    try {
      const formData = new FormData();
      
      // FR-10 Compliance: Capture a sequence of 3 consecutive frames over 1.5 seconds 
      // to allow the backend liveness module to detect motion (blink/head-turn).
      const frames = [];
      for (let i = 0; i < 3; i++) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) frames.push(imageSrc);
        
        // Wait 500ms before taking the next frame (creates a 1-second motion window)
        if (i < 2) await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (frames.length === 0) throw new Error("Camera capture failed.");

      // Convert all frames to blobs and append them to the request
      for (let i = 0; i < frames.length; i++) {
        const res = await fetch(frames[i]);
        const blob = await res.blob();
        formData.append(`frame_${i + 1}`, blob, `scan_sequence_${i + 1}.jpg`);
      }

      // If a session is open, send the session details to restrict the search pool
      if (activeSession) {
        formData.append("course", activeSession.course);
        formData.append("programme", activeSession.programme);
        formData.append("group", activeSession.group);
      }

      // Replace with your actual Render API endpoint
      const response = await fetch('https://smart-attendance-backend-x0ph.onrender.com/api/verify-attendance', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        // Scenario A: No active session. Only checking if it's a Course Rep trying to open one.
        if (!activeSession) {
          if (data.role === 'Course Rep') {
            setRepDetails({
              name: data.student_name,
              programme: data.programme, // e.g. "BSc Information Technology"
              group: data.group          // e.g. "A"
            });
            setIsRepSetupMode(true); // Unlock the setup form
          } else {
            setScanResult({
              status: 'error',
              message: 'No active session. Only Course Reps can open sessions.',
              image: frames[0] // Show the first frame as the result thumbnail
            });
          }
        } 
        // Scenario B: Session is active. Scanning a student for attendance.
        else {
          setScanResult({
            status: 'success',
            message: 'Attendance Verified! (Liveness Confirmed)',
            studentName: data.student_name,
            image: frames[0]
          });
        }
      } else {
        setScanResult({
          status: 'error',
          message: data.message || 'Face not recognized or liveness check failed. Try again.',
          image: frames[0]
        });
      }
    } catch (error) {
      console.error(error);
      setScanResult({
        status: 'error',
        message: 'Server connection failed.',
        image: frames && frames.length > 0 ? frames[0] : null
      });
    } finally {
      setIsScanning(false);
      
      // Auto-clear student result after 3 seconds so the next student can scan
      if (activeSession) {
        setTimeout(() => setScanResult(null), 3000);
      } else if (!isRepSetupMode) {
        setTimeout(() => setScanResult(null), 3000);
      }
    }
  }, [webcamRef, activeSession, isRepSetupMode]);

  return (
    <div style={styles.container}>
      
      {/* Dynamic Header */}
      <div style={styles.header}>
        {activeSession ? (
          <>
            <h1 style={styles.title}>Live Attendance: {activeSession.course}</h1>
            <p style={styles.subtitle}>
              {activeSession.programme} • Level {activeSession.level} • Group {activeSession.group}
            </p>
            <div style={styles.sessionBadge}>
              <span style={styles.pulse}></span>
              Session Open (Managed by {activeSession.repName})
            </div>
          </>
        ) : (
          <>
            <h1 style={styles.title}>System Standby</h1>
            <p style={styles.subtitle}>Course Representative: Please scan your face to open a class session.</p>
          </>
        )}
      </div>

      {/* Course Rep Session Setup Form (Appears after Rep scans face) */}
      {isRepSetupMode && !activeSession ? (
        <div style={styles.setupCard}>
          <h2 style={{margin: '0 0 5px 0', fontSize: '1.5rem'}}>Welcome, {repDetails.name}</h2>
          <p style={{margin: '0 0 20px 0', color: '#94a3b8'}}>Setup Session for {repDetails.programme} (Group {repDetails.group})</p>
          
          <form onSubmit={handleStartSession} style={{display: 'flex', flexDirection: 'column', gap: '15px', width: '100%'}}>
            <div>
              <label style={styles.label}>Course Code / Name</label>
              <input type="text" name="course" required value={sessionForm.course} onChange={handleFormChange} placeholder="e.g. IT401" style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Level</label>
              <select name="level" required value={sessionForm.level} onChange={handleFormChange} style={styles.input}>
                <option value="" disabled>Select Level</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
              </select>
            </div>
            <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
              <button type="submit" style={styles.primaryButton}>Open Session</button>
              <button type="button" onClick={() => setIsRepSetupMode(false)} style={styles.secondaryButton}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        /* The Camera Scanner Card */
        <div style={styles.scannerCard}>
          <div style={styles.webcamContainer}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={styles.webcam}
              mirrored={true}
            />
            
            {isScanning && (
              <div style={styles.scanningOverlay}>
                <div style={styles.scanLine}></div>
                <p style={styles.scanningText}>Analyzing Biometrics...</p>
              </div>
            )}
          </div>

          <button 
            onClick={captureAndVerify} 
            disabled={isScanning}
            style={{
              ...styles.scanButton,
              opacity: isScanning ? 0.5 : 1,
              cursor: isScanning ? 'not-allowed' : 'pointer'
            }}
          >
            {isScanning ? 'Processing Sequence...' : (activeSession ? 'Student Check-In' : 'Course Rep Login')}
          </button>
        </div>
      )}

      {/* Success / Error Popup */}
      {scanResult && !isRepSetupMode && (
        <div style={{
          ...styles.resultPopup,
          backgroundColor: scanResult.status === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)'
        }}>
          {scanResult.image && <img src={scanResult.image} alt="Captured" style={styles.resultImage} />}
          <div style={styles.resultTextContainer}>
            <h2 style={styles.resultStatus}>
              {scanResult.status === 'success' ? '✅ Verified' : '❌ Access Denied'}
            </h2>
            <p style={styles.resultMessage}>{scanResult.message}</p>
            {scanResult.status === 'success' && scanResult.studentName && (
              <p style={styles.studentName}>{scanResult.studentName}</p>
            )}
          </div>
        </div>
      )}

      {/* End Session Button (Only visible during active session) */}
      {activeSession && (
        <button onClick={handleEndSession} style={styles.endSessionBtn}>
          End Session & Lock Kiosk
        </button>
      )}
    </div>
  );
}

// Styling Dictionary
const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0f172a', fontFamily: '"Times New Roman", Times, serif', color: '#ffffff', position: 'relative', overflow: 'hidden' },
  header: { textAlign: 'center', marginBottom: '30px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  title: { fontSize: '2.5rem', fontWeight: '700', margin: '0 0 10px 0', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: '1.2rem', color: '#94a3b8', margin: 0 },
  sessionBadge: { marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid rgba(52, 211, 153, 0.3)' },
  pulse: { width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981', animation: 'pulse 1.5s infinite' },
  scannerCard: { backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(16px)', padding: '20px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 },
  setupCard: { backgroundColor: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(16px)', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '450px', border: '1px solid rgba(255, 255, 255, 0.1)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  label: { display: 'block', marginBottom: '5px', color: '#cbd5e1', fontWeight: 'bold' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#fff', marginBottom: '5px' },
  primaryButton: { flex: 1, padding: '12px', backgroundColor: '#3b82f6', color: '#fff', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer' },
  secondaryButton: { flex: 1, padding: '12px', backgroundColor: 'transparent', color: '#cbd5e1', fontWeight: 'bold', borderRadius: '8px', border: '1px solid #475569', cursor: 'pointer' },
  webcamContainer: { position: 'relative', width: '100%', maxWidth: '500px', aspectRatio: '1/1', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#000', boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.05)' },
  webcam: { width: '100%', height: '100%', objectFit: 'cover' },
  scanButton: { marginTop: '25px', padding: '16px 40px', fontSize: '1.2rem', fontWeight: 'bold', color: '#ffffff', backgroundColor: '#3b82f6', border: 'none', borderRadius: '12px', transition: 'all 0.3s ease', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)' },
  scanningOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  scanLine: { width: '100%', height: '4px', backgroundColor: '#60a5fa', boxShadow: '0 0 20px 4px #60a5fa', animation: 'scan 2s linear infinite' },
  scanningText: { marginTop: '20px', fontSize: '1.2rem', fontWeight: '600', letterSpacing: '2px' },
  resultPopup: { position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 30px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', zIndex: 50, backdropFilter: 'blur(10px)', animation: 'slideUp 0.4s ease-out' },
  resultImage: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ffffff' },
  resultTextContainer: { display: 'flex', flexDirection: 'column' },
  resultStatus: { margin: '0 0 5px 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff' },
  resultMessage: { margin: 0, fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)' },
  studentName: { margin: '5px 0 0 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#ffffff' },
  endSessionBtn: { position: 'absolute', bottom: '30px', padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};