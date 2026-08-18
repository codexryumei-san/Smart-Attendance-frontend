import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";

export default function RegisterStudent() {
  const [formData, setFormData] = useState({ 
    surname: "", 
    firstName: "", 
    otherName: "", 
    indexNumber: "", 
    course: "",  // This acts as the Programme
    level: "",
    group: "" 
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [webcamImage, setWebcamImage] = useState(null);
  const [captureMode, setCaptureMode] = useState("upload");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const webcamRef = useRef(null);

  // Explicitly tell the browser to use the front camera and set a resolution
  // This prevents the "blank webcam" bug
  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "user"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Auto-clear the group if they change their programme away from IT
      if (name === "course" && value !== "BSc Information Technology") {
        newData.group = "";
      }
      return newData;
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setWebcamImage(null);
    }
  };

  const captureWebcam = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setWebcamImage(imageSrc);
      setImageFile(null);
    }
  }, [webcamRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const submissionData = new FormData();
      
      const combinedName = `${formData.firstName} ${formData.otherName ? formData.otherName + ' ' : ''}${formData.surname}`.trim();
      
      submissionData.append("name", combinedName); 
      submissionData.append("surname", formData.surname);
      submissionData.append("firstName", formData.firstName);
      submissionData.append("otherName", formData.otherName);
      submissionData.append("indexNumber", formData.indexNumber);
      submissionData.append("course", formData.course);
      submissionData.append("level", formData.level);
      
      // Only send the group if they selected IT
      if (formData.course === "BSc Information Technology") {
        submissionData.append("group", formData.group);
      }

      if (captureMode === "upload" && imageFile) {
        submissionData.append("image", imageFile);
      } else if (captureMode === "webcam" && webcamImage) {
        const res = await fetch(webcamImage);
        const blob = await res.blob();
        submissionData.append("image", blob, "webcam-capture.jpg");
      } else {
        throw new Error("Please provide a biometric image.");
      }

      const response = await fetch("https://smart-attendance-backend-x0ph.onrender.com/api/register-student", {
        method: "POST",
        body: submissionData,
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: `Successfully registered ${combinedName}!` });
        // Reset form to blank slate
        setFormData({ surname: "", firstName: "", otherName: "", indexNumber: "", course: "", level: "", group: "" });
        setImageFile(null);
        setWebcamImage(null);
      } else {
        setStatus({ type: "error", message: result.message || "Failed to register student." });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: error.message || "Server connection failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Enroll New Student</h2>
        <p className="mt-1 text-slate-500">Enter student details and capture or upload a biometric reference image.</p>
      </div>

      {status.message && (
        <div className={`mb-6 rounded-lg p-4 font-medium ${status.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Name Fields Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label className="font-semibold text-slate-700">Surname / Last Name <span className="text-red-500">*</span></label>
            <input type="text" name="surname" required value={formData.surname} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. Doe" />
          </div>
          
          <div className="space-y-2">
            <label className="font-semibold text-slate-700">First Name <span className="text-red-500">*</span></label>
            <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. John" />
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-slate-700">Other Name(s)</label>
            <input type="text" name="otherName" value={formData.otherName} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Optional" />
          </div>
        </div>

        {/* Academic Details Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label className="font-semibold text-slate-700">Index Number <span className="text-red-500">*</span></label>
            <input type="text" name="indexNumber" required value={formData.indexNumber} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. 04090001" />
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-slate-700">Level <span className="text-red-500">*</span></label>
            <select name="level" required value={formData.level} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option value="" disabled>Select Level</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-slate-700">Programme <span className="text-red-500">*</span></label>
            <select name="course" required value={formData.course} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option value="" disabled>Select Programme</option>
              <option value="BSc Information Technology">BSc Information Technology</option>
              <option value="BSc Computer Science">BSc Computer Science</option>
              <option value="BSc Software Engineering">BSc Software Engineering</option>
            </select>
          </div>
        </div>

        {/* Dynamic Group Dropdown - Only shows if IT is selected */}
        {formData.course === "BSc Information Technology" && (
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="space-y-2 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <label className="font-semibold text-indigo-900">IT Group Section <span className="text-red-500">*</span></label>
              <select name="group" required value={formData.group} onChange={handleInputChange} className="w-full rounded-lg border border-indigo-300 px-4 py-2 text-slate-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm">
                <option value="" disabled>Select Group</option>
                <option value="A">Group A</option>
                <option value="B">Group B</option>
                <option value="C">Group C</option>
                <option value="D">Group D</option>
                <option value="E">Group E</option>
                <option value="F">Group F</option>
              </select>
            </div>
          </div>
        )}

        {/* Biometric Image Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="font-semibold text-slate-700">Biometric Reference Image <span className="text-red-500">*</span></label>
          
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
            <button type="button" onClick={() => setCaptureMode("upload")} className={`px-4 py-2 rounded-md font-medium transition-all ${captureMode === "upload" ? "bg-white shadow text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}>Upload File</button>
            <button type="button" onClick={() => setCaptureMode("webcam")} className={`px-4 py-2 rounded-md font-medium transition-all ${captureMode === "webcam" ? "bg-white shadow text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}>Capture Camera</button>
          </div>

          {captureMode === "upload" && (
            <div className="mt-1 flex justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-8 hover:bg-slate-50">
              <div className="text-center">
                <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              </div>
            </div>
          )}

          {captureMode === "webcam" && (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              {webcamImage ? (
                <div className="relative">
                  <img src={webcamImage} alt="Captured" className="rounded-lg shadow-sm w-full max-w-sm" />
                  <button type="button" onClick={() => setWebcamImage(null)} className="absolute top-2 right-2 rounded-full bg-red-600 p-2 text-white shadow-lg hover:bg-red-700">Retake</button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  {/* Added videoConstraints to force camera activation */}
                  <Webcam 
                    audio={false} 
                    ref={webcamRef} 
                    screenshotFormat="image/jpeg" 
                    className="rounded-lg shadow-sm w-full max-w-sm border border-slate-300 bg-black" 
                    mirrored={true} 
                    videoConstraints={videoConstraints}
                  />
                  <button type="button" onClick={captureWebcam} className="rounded-lg bg-indigo-600 px-6 py-2 text-white font-medium hover:bg-indigo-500 shadow">Capture Photo</button>
                </div>
              )}
            </div>
          )}
        </div>

        <button type="submit" disabled={isSubmitting || (!imageFile && !webcamImage)} className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-lg font-bold text-white shadow hover:bg-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed mt-4 transition-colors">
          {isSubmitting ? "Registering Student..." : "Complete Registration"}
        </button>
      </form>
    </div>
  );
}