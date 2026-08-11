import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


// Page Imports
import Login from './pages/Login';
import AdminPortal from './pages/AdminPortal';
import LecturerPortal from './pages/LecturerPortal';
import KioskMode from './pages/KioskMode';

function App() {
  return (
    <Router>
      <Routes>
        {/* The root path now loads the Login page */}
        <Route path="/" element={<Login />} />
        
        {/* Portal Routes */}
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/lecturer" element={<LecturerPortal />} />
        <Route path="/kiosk" element={<KioskMode />} />
      </Routes>
    </Router>
  );
}

export default App;