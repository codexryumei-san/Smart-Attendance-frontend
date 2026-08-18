export default function Dashboard() {
  const stats = [
    { label: "Total Enrolled Students", value: "0", color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Active Courses", value: "0", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Today's Sessions", value: "0", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "System Status", value: "Online", color: "text-green-600", bg: "bg-green-50" },
  ];

  const recentActivity = []; // Blank slate

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-indigo-600 p-8 text-white shadow-lg shadow-indigo-600/20">
        <h2 className="text-3xl font-bold">Welcome back, Administrator.</h2>
        <p className="mt-2 text-indigo-100 opacity-90">
          The Smart Attendance biometric engine is online and ready for today's classes.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className={`mb-4 inline-flex rounded-lg p-3 ${stat.bg}`}>
              <svg className={`h-6 w-6 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Mockup */}
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent System Activity</h3>
        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <p className="text-slate-500 italic py-4">No recent activity logged in the system.</p>
          ) : (
            recentActivity.map((activity, i) => (
              <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                  <p className="text-slate-700 font-medium">{activity.msg}</p>
                </div>
                <span className="text-sm text-slate-400">{activity.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}