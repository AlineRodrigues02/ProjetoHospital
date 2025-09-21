// src/api.js
const BASE = "http://localhost:3333";

async function api(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `HTTP ${res.status}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export const Auth = {
  login: (username, password) => api("/auth/login", { method: "POST", body: { username, password } }),
};

export const Patients = {
  create: (name, reason) => api("/patients", { method: "POST", body: { name, reason } }),
  list:  (status) => api(`/patients${status ? `?status=${encodeURIComponent(status)}` : ""}`),
  start: (visitId, doctorId) => api(`/attend/${visitId}/start`, { method: "POST", body: { doctorId } }),
  finish:(visitId) => api(`/attend/${visitId}/finish`, { method: "POST" }),
};

export const HistoryApi = {
  list:  ({ name, from, to, status } = {}) => {
    const q = new URLSearchParams();
    if (name) q.set("name", name);
    if (from) q.set("from", from);
    if (to)   q.set("to", to);
    if (status) q.set("status", status);
    const qs = q.toString();
    return api(`/history${qs ? `?${qs}` : ""}`);
  },
  report: () => api("/reports"),
};
