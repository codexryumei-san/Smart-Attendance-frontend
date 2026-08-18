import { useState } from "react";
import LecturerSidebar from "../components/LecturerSidebar";
import AttendanceLogs from "../components/AttendanceLogs";
import LecturerReports from "../components/LecturerReports";

const PAGE_TITLES = {
  dashboard: "Lecturer Dashboard",
  logs: "Attendance Logs",
  reports: "Course Reports",
};

function PlaceholderPage({ title }) {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-12 shadow-sm transition-all hover:shadow-md">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-slate-500">
        This module is currently being prepared for deployment.
      </p>
    </div>
  );
}

// Added onLogout prop
export default function LecturerPortal({ onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controls the hamburger menu

  function renderPage() {
    switch (activePage) {
      case "dashboard":
        return <PlaceholderPage title="Dashboard Overview" />;
      case "logs":
        return <AttendanceLogs />; 
      case "reports":
        return <LecturerReports />;
      default:
        return <PlaceholderPage title="Page Not Found" />;
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <LecturerSidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="flex-1 overflow-y-auto">
        {/* Header with Hamburger Menu */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 px-10 py-6 backdrop-blur-md">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Lecturer Workspace
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              {PAGE_TITLES[activePage] || "Lecturer Portal"}
            </h1>
          </div>

          {/* Hamburger Menu Section */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Dropdown Card */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-64 rounded-xl border border-slate-200 bg-white py-2 shadow-xl z-50">
                {/* User Profile Info */}
                <div className="border-b border-slate-100 px-5 py-3">
                  <p className="text-sm font-bold text-slate-800">Faculty Member</p>
                  <p className="truncate text-xs font-medium text-slate-500">lecturer@gctu.edu.gh</p>
                </div>
                
                {/* Menu Links */}
                <div className="py-2">
                  <button className="flex w-full items-center px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-emerald-600">
                    My Profile
                  </button>
                  <button className="flex w-full items-center px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-emerald-600">
                    Change Password
                  </button>
                </div>
                
                {/* Logout Action */}
                <div className="border-t border-slate-100 py-2">
                  <button 
                    onClick={onLogout} 
                    className="flex w-full items-center px-5 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-10">
          <div className="mx-auto max-w-6xl">
            {renderPage()}
          </div>
        </div>
      </main>
    </div>
  );
}