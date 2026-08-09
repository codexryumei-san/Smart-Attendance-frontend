const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "register", label: "Register Student", icon: "👤" },
  { id: "courses", label: "Courses", icon: "📚" },
  { id: "sessions", label: "Sessions", icon: "🕐" },
  { id: "reports", label: "Reports", icon: "📋" },
  { id: "users", label: "Users", icon: "🔐" },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-900 text-white">
      <div className="border-b border-slate-700 px-6 py-5">
        <h1 className="text-lg font-semibold tracking-tight">
          Smart Attendance
        </h1>
        <p className="mt-1 text-xs text-slate-400">Admin Portal</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 px-6 py-4">
        <p className="text-xs text-slate-400">Offline-first · Local SQLite</p>
      </div>
    </aside>
  );
}
