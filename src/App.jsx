import { useState } from 'react';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AdminPortal from './pages/AdminPortal';
import LecturerPortal from './pages/LecturerPortal';

export default function App() {
  // Tracks if the user is an 'admin' or 'lecturer' (null means not logged in)
  const [userRole, setUserRole] = useState(null); 
  
  // Tracks which screen to show BEFORE logging in ('login' or 'signup')
  const [authView, setAuthView] = useState("login"); 

  // This function is called when someone successfully logs in or signs up
  const handleLogin = (role) => {
    setUserRole(role);
  };

  // This function is called when someone clicks the Log Out button in a portal
  const handleLogout = () => {
    setUserRole(null);
    setAuthView("login"); // Sends them back to the login screen
  };

  // --------------------------------------------------------
  // TRAFFIC CONTROLLER: What screen should we show right now?
  // --------------------------------------------------------

  // SCENARIO 1: The user is NOT logged in yet (!userRole)
  if (!userRole) {
    
    // Are they trying to create an account? Show the SignUp page.
    if (authView === "signup") {
      return (
        <SignUp 
          onBackToLogin={() => setAuthView("login")} 
          onRegister={handleLogin} 
        />
      );
    }
    
    // Otherwise, show the normal Login page.
    return (
      <Login 
        onLogin={handleLogin} 
        onNavigateToSignUp={() => setAuthView("signup")} 
      />
    );
  }

  // SCENARIO 2: The user IS logged in. Show them their portal!
  return (
    <div className="relative min-h-screen">
      {userRole === 'admin' && <AdminPortal onLogout={handleLogout} />}
      {userRole === 'lecturer' && <LecturerPortal onLogout={handleLogout} />}
    </div>
  );
}