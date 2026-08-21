import { useState } from "react";

export default function SignUp({ onBackToLogin, onRegister }) {
  const [fullname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("lecturer"); // Default role
  const [showPassword, setShowPassword] = useState(false);

 const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Change this:
      // const response = await fetch("https://smart-attendance-backend-x0ph.onrender.com/api/register", {

      // To this:
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: name,
          email: email, 
          password: password,
          role: role 
        })
      });

      const data = await response.json();

      // If the backend says success, log them in!
      if (response.ok) {
        onRegister(data.role); 
      } else {
        // Show an error if the email is already taken
        alert(data.error || "Registration failed. Please try again."); 
      }
    } catch (error) {
      alert("Could not connect to the server. Please check your internet connection.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 font-sans sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-slate-100">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Register as staff for the SmartCheck System
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          
          {/* Full Name Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 transition-colors hover:bg-white"
              placeholder="Dr. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Email address</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 transition-colors hover:bg-white"
              placeholder="name@gctu.edu.gh"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="block w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 transition-colors hover:bg-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.71-1.59c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" /></svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 hover:bg-white"
            >
              <option value="lecturer">Lecturer</option>
              <option value="admin">Administrator</option>
              <option value="course_rep">Course Representative</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Account
          </button>
        </form>

        {/* Back to Login Link */}
        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <button onClick={onBackToLogin} className="font-bold text-indigo-600 hover:text-indigo-500">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}