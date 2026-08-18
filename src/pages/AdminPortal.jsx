import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import RegisterStudent from "../components/RegisterStudent";
import UserManagement from "../components/UserManagement";
import CourseManagement from "../components/CourseManagement";

const PAGE_TITLES = {
  dashboard: "Dashboard Overview",
  register: "Register New Student",
  users: "User Management",
  courses: "Manage Group Courses",
};

export default function AdminPortal({ onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [isMenuLocked, setIsMenuLocked] = useState(false); // Controls the click-to-stay behavior

  function renderPage() {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "register":
        return <RegisterStudent />;
      case "users":
        return <UserManagement />;
      case "courses":
        return <CourseManagement />;
      default:
        return <Dashboard />;
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="flex-1 overflow-y-auto">
        {/* Glassmorphism Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 px-10 py-6 backdrop-blur-md">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Admin Workspace
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              {PAGE_TITLES[activePage] || "Admin Portal"}
            </h1>
          </div>

          {/* User Profile Dropdown Area (Hover & Click) */}
          <div 
            className="relative group"
            onMouseLeave={() => setIsMenuLocked(false)} // Unlocks the menu when you move away
          >
            <button 
              onClick={() => setIsMenuLocked(!isMenuLocked)}
              className="flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1 pr-4 text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {/* Avatar with Initial */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white shadow-sm">
                A
              </div>
              <span className="text-sm font-bold text-slate-700">Admin</span>
              <svg className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Card */}
            <div className={`absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white py-2 shadow-xl z-50 transition-all duration-200 origin-top-right ${
              isMenuLocked 
                ? 'opacity-100 scale-100 visible' 
                : 'opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible'
            }`}>
              {/* User Profile Info */}
              <div className="border-b border-slate-100 px-5 py-4 bg-slate-50 rounded-t-xl">
                <p className="text-sm font-bold text-slate-800">System Administrator</p>
                <p className="truncate text-xs font-medium text-slate-500 mt-0.5">admin@gctu.edu.gh</p>
              </div>
              
              {/* Menu Links */}
              <div className="py-2">
                <button className="flex w-full items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  My Profile
                </button>
                <button className="flex w-full items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Change Password
                </button>
              </div>
              
              {/* Logout Action */}
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
        <div className="p-10">
          <div className="mx-auto max-w-6xl">{renderPage()}</div>
        </div>
      </main>
    </div>
  );
}