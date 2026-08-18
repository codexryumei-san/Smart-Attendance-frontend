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

// Notice we added onLogout as a prop here
export default function AdminPortal({ onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controls the hamburger menu

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
        {/* Header with Hamburger Menu */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 px-10 py-6 backdrop-blur-md">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Admin Workspace
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              {PAGE_TITLES[activePage] || "Admin Portal"}
            </h1>
          </div>

          {/* Hamburger Menu Section */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                  <p className="text-sm font-bold text-slate-800">System Administrator</p>
                  <p className="truncate text-xs font-medium text-slate-500">admin@gctu.edu.gh</p>
                </div>
                
                {/* Menu Links */}
                <div className="py-2">
                  <button className="flex w-full items-center px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-600">
                    My Profile
                  </button>
                  <button className="flex w-full items-center px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-600">
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
          <div className="mx-auto max-w-6xl">{renderPage()}</div>
        </div>
      </main>
    </div>
  );
}