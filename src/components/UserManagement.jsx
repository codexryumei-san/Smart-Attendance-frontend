import { useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([]); // Blank slate

  const toggleRole = (id, currentRole) => {
    const newRole = currentRole === "Student" ? "Course Rep" : "Student";
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const removeUser = (id) => {
    if(window.confirm("Are you sure you want to remove this user from the system?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">System Users & Roles</h2>
        <p className="text-slate-500 mt-1">Manage system access, view academic details, and assign Course Representatives.</p>
      </div>
      
      {/* Added overflow-x-auto so the table scrolls nicely on smaller laptop screens */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-white text-slate-700 border-b">
              <th className="p-4 font-bold">Index Number</th>
              <th className="p-4 font-bold">Full Name</th>
              <th className="p-4 font-bold">Programme</th>
              <th className="p-4 font-bold">Group</th>
              <th className="p-4 font-bold">System Role</th>
              <th className="p-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">
                  No users found. Please register students first.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-semibold text-slate-600">{user.index}</td>
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-slate-700">{user.programme}</td>
                  <td className="p-4">
                    {/* Only show the group badge if the student has a group assigned */}
                    {user.group ? (
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-bold text-sm border border-slate-200">
                        Group {user.group}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${user.role === 'Course Rep' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 flex gap-3">
                    <button onClick={() => toggleRole(user.id, user.role)} className="text-indigo-600 hover:underline font-bold">
                      {user.role === "Student" ? "Promote to Rep" : "Demote to Student"}
                    </button>
                    <span className="text-slate-300">|</span>
                    <button onClick={() => removeUser(user.id)} className="text-red-600 hover:underline font-bold">
                      Remove User
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}