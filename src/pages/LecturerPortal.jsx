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

export default function LecturerPortal({ onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [isMenuLocked, setIsMenuLocked] = useState(false); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controls mobile sliding sidebar

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
      
      {/* Upgraded Responsive Sidebar */}
      <LecturerSidebar 
        activePage={activePage} 
        onNavigate={setActivePage} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Glassmorphism Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-md md:px-10 md:py-6">
          
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Toggle Button (Hidden on Laptops) */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 hidden md:block">
                Lecturer Workspace
              </p>
              <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 md:text-2xl">
                {PAGE_TITLES[activePage] || "Lecturer Portal"}
              </h1>
            </div>
          </div>

          {/* User Profile Dropdown Area (Hover & Click) */}
          <div 
            className="relative group"
            onMouseLeave={() => setIsMenuLocked(false)}
          >
            <button 
              onClick={() => setIsMenuLocked(!isMenuLocked)}
              className="flex items-center gap-2 md:gap-3 rounded-full border border-slate-200 bg-white p-1 pr-2 md:pr-4 text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-emerald-600 text-sm md:text-lg font-bold text-white shadow-sm">
                L
              </div>
              <span className="hidden md:block text-sm font-bold text-slate-700">Lecturer</span>
              <svg className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Card */}
            <div className={`absolute right-0 mt-2 w-56 md:w-64 rounded-xl border border-slate-200 bg-white py-2 shadow-xl z-50 transition-all duration-200 origin-top-right ${
              isMenuLocked 
                ? 'opacity-100 scale-100 visible' 
                : 'opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible'
            }`}>
              <div className="border-b border-slate-100 px-5 py-4 bg-slate-50 rounded-t-xl">
                <p className="text-sm font-bold text-slate-800">Faculty Member</p>
                <p className="truncate text-xs font-medium text-slate-500 mt-0.5">lecturer@gctu.edu.gh</p>
              </div>
              
              <div className="py-2">
                <button className="flex w-full items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  My Profile
                </button>
                <button className="flex w-full items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Change Password
                </button>
              </div>
              
              <div className="border-t border-slate-100 py-2">
                <button 
                  onClick={onLogout} 
                  className="flex w-full items-center gap-3 px-5 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-4 md:p-10">
          <div className="mx-auto max-w-6xl">
            {renderPage()}
          </div>
        </div>
      </main>
    </div>
  );
}