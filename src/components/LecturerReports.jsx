import { useState } from "react";

export default function LecturerReports() {
  const [filters, setFilters] = useState({
    courseQuery: "", // Accepts Course Name OR Course Code
    programme: "",
    level: "",
    group: "",
    date: "",
    week: "All Weeks" // Default to all weeks for a full course report
  });

  const [reportData, setReportData] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };
      if (name === "programme" && value !== "BSc Information Technology") {
        newFilters.group = "";
      }
      return newFilters;
    });
  };

  const handleExport = (e) => {
    e.preventDefault();
    setIsExporting(true);
    
    // Simulate generating and downloading a CSV/PDF report
    setTimeout(() => {
      setIsExporting(false);
      alert("Report successfully generated! (In production, this will download a .csv or .pdf file to your device)");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Export Attendance Reports</h2>
            <p className="mt-1 text-sm text-slate-500">Generate printable attendance sheets using course name or code.</p>
          </div>
        </div>

        <form onSubmit={handleExport} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Unified Course Name or Code Input */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-700">Course Name or Code</label>
              <input 
                type="text" 
                name="courseQuery" 
                value={filters.courseQuery} 
                onChange={handleFilterChange} 
                required 
                placeholder="e.g. Multimedia Systems or IT401" 
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" 
              />
            </div>

            {/* Programme Dropdown */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-700">Programme (Optional)</label>
              <select name="programme" value={filters.programme} onChange={handleFilterChange} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="">All Programmes</option>
                <option value="BSc Information Technology">BSc Information Technology</option>
                <option value="BSc Computer Science">BSc Computer Science</option>
                <option value="BSc Software Engineering">BSc Software Engineering</option>
              </select>
            </div>

            {/* Level Dropdown */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-700">Level (Optional)</label>
              <select name="level" value={filters.level} onChange={handleFilterChange} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="">All Levels</option>
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
                <select name="group" value={filters.group} onChange={handleFilterChange} className="w-full rounded-lg border border-emerald-300 bg-white px-4 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <option value="">All Groups</option>
                  <option value="A">Group A</option>
                  <option value="B">Group B</option>
                  <option value="C">Group C</option>
                  <option value="D">Group D</option>
                  <option value="E">Group E</option>
                  <option value="F">Group F</option>
                </select>
              </div>
            ) : (
              <div className="hidden md:block"></div> 
            )}

            {/* Date Input */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-700">Specific Date (Optional)</label>
              <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>

            {/* Academic Week Dropdown */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-700">Academic Week</label>
              <select name="week" value={filters.week} onChange={handleFilterChange} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="All Weeks">All Weeks (Full Semester)</option>
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
            <button type="submit" disabled={isExporting} className="flex items-center gap-2 rounded-lg bg-slate-800 px-6 py-2.5 font-bold text-white shadow-sm transition-all hover:bg-slate-700 disabled:opacity-70">
              {isExporting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Generating CSV...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Download Report (.csv)
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Report Preview Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Report Preview</h3>
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
                <th className="p-4 font-bold">Total Attendance</th>
                <th className="p-4 font-bold">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <svg className="h-12 w-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <p className="font-medium text-slate-500 text-lg">No data available for preview.</p>
                      <p className="text-sm mt-1">Configure your report above and generate a CSV.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reportData.map((data, index) => (
                  // Map out actual preview data here when connected to the backend
                  <tr key={index}></tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}