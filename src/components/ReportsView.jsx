import { useState, useEffect } from "react";
import api from "../api";

export default function ReportsView() {
  const [report, setReport] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isOverriding, setIsOverriding] = useState(false);
  
  // Filters
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  
  // Modal state
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [overrideReason, setOverrideReason] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    fetchCourses();
    fetchAnalytics();
    fetchReport();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [selectedCourse, selectedDate, selectedGroup]);

  async function fetchCourses() {
    try {
      const data = await api.getCourses();
      setCourses(data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  }

  async function fetchAnalytics() {
    try {
      const data = await api.getAnalyticsSummary();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    }
  }

  async function fetchReport() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCourse) params.append("course_id", selectedCourse);
      if (selectedDate) params.append("date", selectedDate);
      if (selectedGroup) params.append("group", selectedGroup);
      
      const data = await api.getAttendanceReport(params.toString());
      setReport(data.report);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch attendance report");
    } finally {
      setLoading(false);
    }
  }

  async function handleExportCSV() {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (selectedCourse) params.append("course_id", selectedCourse);
      if (selectedDate) params.append("date", selectedDate);
      if (selectedGroup) params.append("group", selectedGroup);
      
      await api.exportAttendanceCSV(params.toString());
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to export CSV");
    } finally {
      setIsExporting(false);
    }
  }

  function openOverrideModal(student) {
    setSelectedStudent(student);
    setOverrideReason("");
    // For manual override, we need a session_id. If the student is absent and has no session,
    // we'll need to handle this case. For now, we'll use the most recent session for the course.
    setSelectedSessionId(student.session_id || null);
    setShowOverrideModal(true);
  }

  async function handleOverride() {
    if (!overrideReason.trim()) {
      setError("Override reason is required");
      return;
    }

    setIsOverriding(true);
    try {
      await api.overrideAttendance({
        session_id: selectedSessionId,
        student_id: selectedStudent.student_id,
        action: "mark_present",
        override_reason: overrideReason,
        course_id: selectedCourse  // Pass course_id as fallback
      });
      
      setShowOverrideModal(false);
      setOverrideReason("");
      setSelectedStudent(null);
      fetchReport();
      fetchAnalytics();
    } catch (err) {
      setError(err.message || "Failed to override attendance");
    } finally {
      setIsOverriding(false);
    }
  }

  async function handleMarkAbsent(student) {
    if (!student.session_id) {
      setError("Cannot mark absent: no session associated with this attendance record");
      return;
    }

    try {
      await api.overrideAttendance({
        session_id: student.session_id,
        student_id: student.student_id,
        action: "mark_absent"
      });
      
      fetchReport();
      fetchAnalytics();
    } catch (err) {
      setError(err.message || "Failed to mark absent");
    }
  }

  function getUniqueGroups() {
    const groups = [...new Set(report.map(r => r.group).filter(g => g))];
    return groups.sort();
  }

  function getUniqueDates() {
    const dates = [...new Set(report.map(r => r.session_date).filter(d => d))];
    return dates.sort().reverse();
  }

  if (loading && report.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Summary Cards */}
      {analytics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-600">Total Students</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{analytics.total_students}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-600">Active Sessions Today</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{analytics.active_sessions}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-600">Avg Attendance Rate</p>
            <p className="mt-2 text-3xl font-bold text-indigo-600">{analytics.average_attendance_rate}%</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-600">Present Today</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {report.filter(r => r.status === "Present").length}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Filters</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name} ({course.course_code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Group
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">All Groups</option>
              {getUniqueGroups().map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Date
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">All Dates</option>
              {getUniqueDates().map((date) => (
                <option key={date} value={date.split('T')[0]}>
                  {new Date(date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Exporting...
                </>
              ) : (
                "Export CSV"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Attendance Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Index Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Time Logged
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {report.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-sm text-slate-500">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                report.map((student) => (
                  <tr key={student.student_id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {student.index_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {student.group || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {student.course_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.status === "Present" ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          Present
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                          Absent
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {student.time_logged
                        ? new Date(student.time_logged).toLocaleTimeString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {student.verification_mode === "manual_override" ? (
                        <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          Manual
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          Biometric
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {student.status === "Absent" ? (
                        <button
                          onClick={() => openOverrideModal(student)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          Mark Present
                        </button>
                      ) : student.session_id ? (
                        <button
                          onClick={() => handleMarkAbsent(student)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Mark Absent
                        </button>
                      ) : (
                        <span className="text-slate-400">No session</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Override Modal */}
      {showOverrideModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Manual Attendance Override
            </h3>
            <div className="mb-4">
              <p className="text-sm text-slate-600">
                <strong>Student:</strong> {selectedStudent.name}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Index Number:</strong> {selectedStudent.index_number}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Course:</strong> {selectedStudent.course_name || "N/A"}
              </p>
            </div>
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Override Reason *
              </label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Please provide a reason for this manual override..."
                required
              />
            </div>
            {!selectedSessionId && (
              <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This will mark attendance for the most recent session of the selected course.
                </p>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowOverrideModal(false);
                  setOverrideReason("");
                  setSelectedStudent(null);
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleOverride}
                disabled={isOverriding}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isOverriding ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  "Confirm Override"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
