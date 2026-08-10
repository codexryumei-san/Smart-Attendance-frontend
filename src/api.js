const API_BASE_URL = "https://smart-attendance-backend-x0ph.onrender.com";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({
    message: response.statusText,
  }));

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data;
}

async function requestWithStatus(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({
    message: response.statusText,
  }));

  // For recognition endpoint, we want to return the data even if status is not ok
  // because recognition statuses like "no_face_detected" are valid responses
  if (path.includes("/recognize")) {
    return data;
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data;
}

export const api = {
  health: () => request("/api/health"),

  registerStudent: (studentData) =>
    request("/api/register", {
      method: "POST",
      body: JSON.stringify(studentData),
    }),

  getCourses: () => request("/api/courses"),

  startSession: (sessionData) =>
    request("/api/sessions/start", {
      method: "POST",
      body: JSON.stringify(sessionData),
    }),

  closeSession: (sessionData) =>
    request("/api/sessions/close", {
      method: "POST",
      body: JSON.stringify(sessionData),
    }),

  getActiveSession: () => request("/api/sessions/active"),

  recognizeFace: (imageData) =>
    requestWithStatus("/api/recognize", {
      method: "POST",
      body: JSON.stringify(imageData),
    }),

  getAttendanceReport: (params = "") =>
    request(`/api/reports/attendance?${params}`),

  overrideAttendance: (overrideData) =>
    request("/api/attendance/override", {
      method: "POST",
      body: JSON.stringify(overrideData),
    }),

  exportAttendanceCSV: async (params = "") => {
    const response = await fetch(`${API_BASE_URL}/api/reports/export?${params}`);
    if (!response.ok) {
      throw new Error("Failed to export CSV");
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  getAnalyticsSummary: () => request("/api/analytics/summary"),

  resetDemo: () =>
    request("/api/demo/reset", {
      method: "POST",
      body: JSON.stringify({}),
    }),
};

export default api;
