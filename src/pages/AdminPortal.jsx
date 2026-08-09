import { useState } from "react";
import Sidebar from "../components/Sidebar";
import RegisterStudent from "../components/RegisterStudent";
import ReportsView from "../components/ReportsView";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  register: "Register Student",
  courses: "Courses",
  sessions: "Sessions",
  reports: "Reports",
  users: "Users",
};

// Emergency Reset for Live Demo
  const handleResetDemo = async () => {
    try {
        // You can link this to an endpoint that drops active sessions
        await fetch('http://localhost:5000/api/sessions/close', { method: 'POST' });
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
  const [activePage, setActivePage] = useState("register");

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
          <p className="text-xs font-medium uppercase tracking-wider text-indigo-600">
            Administrator
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-900">
            {PAGE_TITLES[activePage] || "Admin Portal"}
          </h1>
        </header>

        <div className="p-8">{renderPage()}</div>
      </main>
    </div>
  );
}
