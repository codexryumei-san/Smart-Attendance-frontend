import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPortal from "./pages/AdminPortal";
import KioskPortal from "./pages/KioskPortal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminPortal />} />
        <Route path="/kiosk" element={<KioskPortal />} />
      </Routes>
    </Router>
  );
}

export default App;
