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
  const [isMenuLocked, setIsMenuLocked] = useState(false); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // NEW: Controls mobile sidebar

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
      
      {/* Upgraded Sidebar */}
      <Sidebar 
        activePage={activePage} 
        onNavigate={setActivePage} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Glassmorphism Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-md md:px-10 md:py-6">
          
          <div className="flex items-center gap-4">
            {/* NEW: Mobile Sidebar Toggle Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 hidden md:block">
                Admin Workspace
              </p>
              <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 md:text-2xl">
                {PAGE_TITLES[activePage] || "Admin Portal"}
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
              className="flex items-center gap-2 md:gap-3 rounded-full border border-slate-200 bg-white p-1 pr-2 md:pr-4 text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow"
            >
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-indigo-600 text-sm md:text-lg font-bold text-white shadow-sm">
                A
              </div>
              <span className="hidden md:block text-sm font-bold text-slate-700">Admin</span>
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
              {/* User Profile Info */}
              <div className="border-b border-slate-100 px-5 py-4 bg-slate-50 rounded-t-xl">
                <p className="text-sm font-bold text-slate-800">System Administrator</p>
                <p className="truncate text-xs font-medium text-slate-500 mt-0.5">admin@gctu.edu.gh</p>
              </div>
              
              <div className="py-2">
                <button className="flex w-full items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700">
                  My Profile
                </button>
                <button className="flex w-full items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700">
                  Change Password
                </button>
              </div>
              
              <div className="border-t border-slate-100 py-2">
                <button 
                  onClick={onLogout} 
                  className="flex w-full items-center gap-3 px-5 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-4 md:p-10">
          <div className="mx-auto max-w-6xl">{renderPage()}</div>
        </div>
      </main>
    </div>
  );
}