import { useState, useRef } from "react";
import Webcam from "react-webcam";
import api from "../api";

const INITIAL_FORM = {
  name: "",
  index_number: "",
  programme: "",
  group: "",
  level: "",
  biometric_consent: false,
};

export default function RegisterStudent() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFeedback(null);
  }

  function handleCapture() {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setFeedback(null);
  }

  function handleRetake() {
    setCapturedImage(null);
    setFeedback(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    if (!capturedImage) {
      setFeedback({ type: "error", message: "Please capture a photo before registering." });
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...form,
        image: capturedImage,
      };
      const result = await api.registerStudent(payload);
      setFeedback({ type: "success", message: result.message });
      setForm(INITIAL_FORM);
      setCapturedImage(null);
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900">
          Register Student
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Capture student bio-data and prepare for biometric enrollment.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Jane Doe"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="index_number"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Index Number
            </label>
            <input
              id="index_number"
              name="index_number"
              type="text"
              required
              value={form.index_number}
              onChange={handleChange}
              placeholder="e.g. CS/2024/001"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="programme"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Programme
            </label>
            <input
              id="programme"
              name="programme"
              type="text"
              required
              value={form.programme}
              onChange={handleChange}
              placeholder="e.g. BSc Computer Science"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="group"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Group
            </label>
            <input
              id="group"
              name="group"
              type="text"
              value={form.group}
              onChange={handleChange}
              placeholder="e.g. Group A"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="level"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Level
            </label>
            <input
              id="level"
              name="level"
              type="text"
              required
              value={form.level}
              onChange={handleChange}
              placeholder="e.g. Level 200"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              name="biometric_consent"
              checked={form.biometric_consent}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-600">
              I confirm the student has provided consent for biometric data
              collection and facial recognition enrollment.
            </span>
          </label>

          {feedback && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                feedback.type === "success"
                  ? "border border-green-200 bg-green-50 text-green-800"
                  : "border border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Registering..." : "Register Student"}
          </button>
        </form>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">
            Webcam Feed
          </p>
          <div className="aspect-[4/3] overflow-hidden rounded-xl border-2 border-slate-300 bg-slate-100">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured"
                className="h-full w-full object-cover"
              />
            ) : (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="mt-3 flex gap-2">
            {capturedImage ? (
              <button
                type="button"
                onClick={handleRetake}
                disabled={isSubmitting}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Retake Photo
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCapture}
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Capture Photo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
