import { useState } from "react";

export default function AttendanceLogs() {
  const [filters, setFilters] = useState({
    course: "",
    programme: "",
    level: "",
    group: "",
    date: "",
    week: "Today"
  });

  // Blank slate for your live testing
  const [attendanceData, setAttendanceData] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };
      // Auto-clear the group if they change their programme away from IT
      if (name === "programme" && value !== "BSc Information Technology") {
        newFilters.group = "";
      }
      return newFilters;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsFiltering(true);
    
    // Simulate a network request for the demo
    setTimeout(() => {
      setIsFiltering(false);
      // In production, you will fetch the filtered data from your Render backend here
      // setAttendanceData(fetchedData);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Filter Attendance Records</h2>
            <p className="mt-1 text-sm text-slate-500">Select class criteria to view student check-in times.</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Course Input */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-700">Course Name</label>
              <input type="text" name="course" value={filters.course} onChange={handleFilterChange} required placeholder="e.g. Multimedia Systems" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>

            {/* Programme Dropdown */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-700">Programme</label>
              <select name="programme" value={filters.programme} onChange={handleFilterChange} required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="" disabled>Select Programme</option>
                <option value="BSc Information Technology">BSc Information Technology</option>
                <option value="BSc Computer Science">BSc Computer Science</option>
                <option value="BSc Software Engineering">BSc Software Engineering</option>
              </select>
            </div>

            {/* Level Dropdown */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-700">Level</label>
              <select name="level" value={filters.level} onChange={handleFilterChange} required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="" disabled>Select Level</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Dynamic Group Dropdown - Only for IT */}
            {filters.programme === "BSc Information Technology" ? (
              <div className="space-y-2 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                <label className="font-semibold text-emerald-900">IT Group</label>
                <select name="group" value={filters.group} onChange={handleFilterChange} required className="w-full rounded-lg border border-emerald-300 bg-white px-4 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <option value="" disabled>Select Group</option>
                  <option value="A">Group A</option>
                  <option value="B">Group B</option>
                  <option value="C">Group C</option>
                  <option value="D">Group D</option>
                  <option value="E">Group E</option>
                  <option value="F">Group F</option>
                </select>
              </div>
            ) : (
              <div className="hidden md:block"></div> /* Empty spacer */
            )}

            {/* Date Input */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-700">Specific Date</label>
              <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>

            {/* Academic Week Dropdown */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-700">Academic Week</label>
              <select name="week" value={filters.week} onChange={handleFilterChange} required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="Today">Today</option>
                <option value="Week 1">Week 1</option>
                <option value="Week 2">Week 2</option>
                <option value="Week 3">Week 3</option>
                <option value="Week 4">Week 4</option>
                <option value="Week 5">Week 5</option>
                <option value="Week 6">Week 6</option>
                <option value="Midterms">Midterms</option>
                <option value="Finals">Finals</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" disabled={isFiltering} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 font-bold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-70">
              {isFiltering ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Generating Logs...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  Search Records
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Class Register</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-white text-slate-700 border-b">
                <th className="p-4 font-bold">Student Name</th>
                <th className="p-4 font-bold">Index Number</th>
                <th className="p-4 font-bold">Programme</th>
                <th className="p-4 font-bold">Level</th>
                <th className="p-4 font-bold">Group</th>
                <th className="p-4 font-bold">Log-in Time</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <svg className="h-12 w-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                      <p className="font-medium text-slate-500 text-lg">No attendance logs found.</p>
                      <p className="text-sm mt-1">Please enter your class criteria and click Search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                attendanceData.map((log, index) => (
                  <tr key={index} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-800">{log.studentName}</td>
                    <td className="p-4 text-slate-600">{log.indexNumber}</td>
                    <td className="p-4 text-slate-600">{log.programme}</td>
                    <td className="p-4 text-slate-600">{log.level}</td>
                    <td className="p-4">
                      {log.group ? (
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-bold text-sm border border-slate-200">{log.group}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4 font-medium text-slate-700">{log.loginTime}</td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">Present</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}