import { useState } from "react";

export default function Login({ onLogin, onNavigateToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // NEW: State for the eye toggle
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    
    try {
      // REAL SECURE LOGIN
      const response = await fetch("https://smart-attendance-backend-x0ph.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: email, 
          password: password,
          role: role // Only include this if you added a role dropdown to the login form
        })
      });

      const data = await response.json();

      // If the credentials match the database, route them to the portal
      if (response.ok) {
        onLogin(data.role); 
      } else {
        // Display the error from the backend (e.g., "Invalid password")
        setError(data.error || "Invalid credentials.");
      }
    } catch (error) {
      setError("Could not connect to the server. Please check your internet connection.");
    }
  };
    
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 font-sans sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-slate-100">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
            {/* Minimalist Camera/AI Icon */}
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
            SmartCheck System
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Facial Recognition Attendance Portal
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* Error Message Display */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
              {/* Sign Up Link */}
              <p className="mt-6 text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <button 
                onClick={onNavigateToSignUp} 
                className="font-bold text-indigo-600 hover:text-indigo-500"
              type="button"> 
               Sign up
                </button>
              </p>
            </div>
          )}

          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 transition-colors hover:bg-white"
                placeholder="admin@gctu.edu.gh"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field with Eye Icon */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="relative mt-1">
                <input
                  // NEW: Dynamically change type based on state
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 transition-colors hover:bg-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                
                {/* NEW: The Eye Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    // Eye Slash Icon (When password is visible)
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.71-1.59c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" />
                    </svg>
                  ) : (
                    // Normal Eye Icon (When password is hidden)
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign in to Portal
          </button>
        </form>
      </div>
    </div>
  );
}