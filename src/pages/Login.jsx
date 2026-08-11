import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // Default role
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Route the user to their designated portal based on the selected role
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'lecturer') {
      navigate('/lecturer');
    } else if (role === 'kiosk') {
      navigate('/kiosk');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Smart Attendance System</h2>
        <p style={styles.subtitle}>Sign in to access your portal</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Portal Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={styles.select}
            >
              <option value="admin">Administrator</option>
              <option value="lecturer">Lecturer</option>
              <option value="kiosk">Kiosk Mode (Webcam Scanner)</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username / Index Number</label>
            <input 
              type="text" 
              required
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

// Basic inline styling for a clean presentation card
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    fontFamily: 'sans-serif'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    textAlign: 'center',
    margin: '0 0 10px 0',
    color: '#1a202c'
  },
  subtitle: {
    textAlign: 'center',
    margin: '0 0 25px 0',
    color: '#718096',
    fontSize: '14px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#4a5568'
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    fontSize: '14px'
  },
  select: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    fontSize: '14px',
    backgroundColor: '#ffffff'
  },
  button: {
    padding: '12px',
    backgroundColor: '#3182ce',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  }
};