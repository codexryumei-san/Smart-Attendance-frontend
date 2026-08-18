import { useState } from "react";

export default function SessionManagement() {
  const [sessions, setSessions] = useState([]); // Blank slate
  const [formData, setFormData] = useState({ courseName: "", programme: "", level: "", day: "", startTime: "", endTime: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSessions([...sessions, { id: Date.now(), ...formData }]);
    setFormData({ courseName: "", programme: "", level: "", day: "", startTime: "", endTime: "" });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Schedule a Class Session</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label className="font-semibold text-slate-700 block mb-1">Course Name</label>
            <input type="text" required value={formData.courseName} onChange={e => setFormData({...formData, courseName: e.target.value})} className="w-full border rounded-lg px-4 py-2" placeholder="e.g. Multimedia Systems" />
          </div>
          
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Programme</label>
            <select required value={formData.programme} onChange={e => setFormData({...formData, programme: e.target.value})} className="w-full border rounded-lg px-4 py-2 bg-white">
              <option value="" disabled>Select Programme</option>
              <option value="BSc Information Technology">BSc Information Technology</option>
              <option value="BSc Computer Science">BSc Computer Science</option>
            </select>
          </div>
          
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Level</label>
            <select required value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full border rounded-lg px-4 py-2 bg-white">
              <option value="" disabled>Select Level</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Day of the Week</label>
            <select required value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})} className="w-full border rounded-lg px-4 py-2 bg-white">
              <option value="" disabled>Select Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Start Time</label>
            <input type="time" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">End Time</label>
            <input type="time" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
          </div>

          <div className="md:col-span-3 mt-2">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700">
              Schedule Session
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b">
              <th className="p-4 font-bold">Course Details</th>
              <th className="p-4 font-bold">Schedule</th>
              <th className="p-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-8 text-center text-slate-500 font-medium">No sessions scheduled yet.</td>
              </tr>
            ) : (
              sessions.map((session) => (
                <tr key={session.id} className="border-b hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{session.courseName}</p>
                    <p className="text-sm text-slate-500">{session.programme} (Level {session.level})</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-block bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full text-sm mb-1">
                      {session.day}
                    </span>
                    <p className="text-sm font-semibold text-slate-600">
                      {session.startTime} - {session.endTime}
                    </p>
                  </td>
                  <td className="p-4">
                    <button onClick={() => setSessions(sessions.filter(s => s.id !== session.id))} className="text-red-600 font-bold hover:underline">
                      Cancel Session
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