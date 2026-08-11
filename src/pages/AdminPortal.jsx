import { useState } from "react";
import Sidebar from "../components/Sidebar";
import RegisterStudent from "../components/RegisterStudent";
import ReportsView from "../components/ReportsView";
import api from "../api";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  register: "Register Student",
  courses: "Courses",
  sessions: "Sessions",
  reports: "Reports",
  users: "Users",
};32

// Emergency Reset for Live Demo
  const handleResetDemo = async () => {
    try {
        // You can link this to an endpoint that drops active sessions
        await fetch('https://smart-attendance-backend-x0ph.onrender.com', { method: 'POST' });
        alert("Demo Reset Successful: All active sessions closed.");
        window.location.reload(); // Refresh the UI
    } catch (error) {
        console.error("Reset failed", error);
    }
  };

// Paste this button somewhere in your JSX render return:
// <button onClick={handleResetDemo} className="bg-red-600 text-white px-4 py-2 rounded">Emergency Reset Demo</button>
function PlaceholderPage({ title }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <p className="text-lg font-medium text-slate-700">{title}</p>
      <p className="mt-2 text-sm text-slate-500">Coming soon.</p>
    </div>
  );
}

export default function AdminPortal() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Admin Portal</h1>
      <p>Student registration and course management.</p>
    </div>
  );
}

export default function AdminPortal() {
  const [activePage, setActivePage] = useState("register");
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  async function handleResetDemo() {
    if (!confirm("Are you sure you want to reset the demo? This will close all active sessions.")) {
      return;
    }
    
    setIsResetting(true);
    try {
      await api.resetDemo();
      setResetMessage({ type: "success", message: "Demo reset successfully! All sessions closed." });
      setTimeout(() => setResetMessage(null), 3000);
    } catch (err) {
      setResetMessage({ type: "error", message: err.message || "Failed to reset demo" });
      setTimeout(() => setResetMessage(null), 3000);
    } finally {
      setIsResetting(false);
    }
  }

  function renderPage() {
    switch (activePage) {
      case "register":
        return <RegisterStudent />;
      case "dashboard":
        return <PlaceholderPage title="Dashboard Overview" />;
      case "courses":
        return <PlaceholderPage title="Course Management" />;
      case "sessions":
        return <PlaceholderPage title="Session History" />;
      case "reports":
        return <ReportsView />;
      case "users":
        return <PlaceholderPage title="User Management" />;
      default:
        return <PlaceholderPage title="Page Not Found" />;
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="flex-1 overflow-y-auto">
        <header className="border-b border-slate-200 bg-white px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-indigo-600">
                Administrator
              </p>
              <h1 className="mt-1 text-xl font-semibold text-slate-900">
                {PAGE_TITLES[activePage] || "Admin Portal"}
              </h1>
            </div>
            <button
              onClick={handleResetDemo}
              disabled={isResetting}
              className="rounded-lg border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-2"
            >
              {isResetting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
                  Resetting...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Demo
                </>
              )}
            </button>
          </div>
          {resetMessage && (
            <div className={`mt-3 rounded-lg px-4 py-2 text-sm flex items-center gap-2 ${
              resetMessage.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}>
              {resetMessage.type === "success" ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {resetMessage.message}
            </div>
          )}
        </header>

        <div className="p-8">{renderPage()}</div>
      </main>
    </div>
  );
}
