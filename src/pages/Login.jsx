import { useState } from "react";

export default function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: "", password: "", role: "admin" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError(""); // Clear error when typing
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate backend authentication delay
    setTimeout(() => {
      // In production, you will send the username and hashed password to your Flask backend here
      // For the defense demo, we are simulating a successful login based on the selected role
      if (credentials.username && credentials.password) {
        onLogin(credentials.role);
      } else {
        setError("Please enter both username and password.");
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 font-sans relative overflow-hidden">
      {/* Background abstract shapes for a modern tech feel */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-600/20 blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/80 p-10 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 text-white shadow-lg">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">SmartCheck</h1>
          <p className="mt-2 text-sm text-slate-400">Secure Portal Authentication</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center text-sm font-medium text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">System Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCredentials({ ...credentials, role: "admin" })}
                className={`rounded-lg border px-4 py-2.5 text-sm font-bold transition-all ${
                  credentials.role === "admin"
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                    : "border-slate-600 bg-slate-700/50 text-slate-400 hover:bg-slate-700"
                }`}
              >
                Administrator
              </button>
              <button
                type="button"
                onClick={() => setCredentials({ ...credentials, role: "lecturer" })}
                className={`rounded-lg border px-4 py-2.5 text-sm font-bold transition-all ${
                  credentials.role === "lecturer"
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                    : "border-slate-600 bg-slate-700/50 text-slate-400 hover:bg-slate-700"
                }`}
              >
                Lecturer
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Username / ID</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter your assigned ID"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-bold text-white transition-all ${
              credentials.role === "admin"
                ? "bg-indigo-600 hover:bg-indigo-500"
                : "bg-emerald-600 hover:bg-emerald-500"
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              "Authenticate Securely"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}