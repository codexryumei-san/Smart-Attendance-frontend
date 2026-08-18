import { useState } from 'react';
import Login from './pages/Login';
import AdminPortal from './pages/AdminPortal';
import LecturerPortal from './pages/LecturerPortal';
import KioskMode from './pages/KioskMode';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'lecturer'
  
  // A simple router state just for the demo 
  // (If you are using react-router-dom, you would use <Routes> instead)
  const [currentView, setCurrentView] = useState('login');

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setCurrentView(role === 'admin' ? 'admin' : 'lecturer');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentView('login');
  };

  // If you want to view the Kiosk easily for testing without logging in
  if (currentView === 'kiosk') {
    return (
      <div className="relative min-h-screen">
        <button onClick={() => setCurrentView('login')} className="absolute top-4 left-4 z-50 bg-slate-800 text-white px-4 py-2 rounded">Exit Kiosk</button>
        <KioskMode />
      </div>
    );
  }

  // Not authenticated? Force the Login Screen.
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen">
        <button onClick={() => setCurrentView('kiosk')} className="absolute top-4 right-4 z-50 bg-slate-800 text-white px-4 py-2 rounded">Launch Kiosk Mode</button>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  // Authenticated? Route to the correct portal based on role.
  return (
    <div className="relative min-h-screen">
      <button 
        onClick={handleLogout} 
        className="absolute top-6 right-64 z-50 bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold border border-red-200 hover:bg-red-200 transition-colors"
      >
        Log Out
      </button>
      
      {userRole === 'admin' && <AdminPortal />}
      {userRole === 'lecturer' && <LecturerPortal />}
    </div>
  );
}