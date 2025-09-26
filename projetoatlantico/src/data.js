
// src/data.js
export const BASE = "http://localhost:3333";
export const PATIENTS_KEY = "patients";
export const HISTORY_KEY = "history";

export function loadPatients() {
  try { return JSON.parse(localStorage.getItem(PATIENTS_KEY) || "[]"); }
  catch { return []; }
}
export function savePatients(h) {
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(h));
}

export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); }
  catch { return []; }
}
export function saveHistory(h) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
}

export const COLOR_INFO = {
  vermelho: {
    label: "Vermelho",
    desc: "Urgente — imediato",
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
    priority: 3,
  },
  amarelo: {
    label: "Amarelo",
    desc: "Moderado — espera média",
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
    priority: 2,
  },
  verde: {
    label: "Verde",
    desc: "Leve — pode esperar",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    priority: 1,
  },
};

export function triageColor(text) {
  const t = (text || "").toLowerCase();
  if (/parada|inconsciente|sangramento|dor\s*forte|urgente|falta de ar|desmaio/.test(t)) return "vermelho";
  if (/febre|fratura|queda|tontura|moderado|vômito|diarreia/.test(t)) return "amarelo";
  return "verde";
}

export function orderQueue(arr) {
  return [...arr].sort((a, b) => {
    const pa = COLOR_INFO[(a.color || "").toLowerCase()]?.priority || 0;
    const pb = COLOR_INFO[(b.color || "").toLowerCase()]?.priority || 0;
    if (pb !== pa) return pb - pa; // vermelho > amarelo > verde
    // fallback para createdAt (podem ser strings)
    const ta = new Date(a.createdAt || 0).getTime();
    const tb = new Date(b.createdAt || 0).getTime();
    return ta - tb;
  });
}
export async function getHistory(filters = {}) {
  const params = new URLSearchParams();
  if (filters.name) params.set("name", filters.name);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.status) params.set("status", filters.status);
  const qs = params.toString();
  const url = `${BASE}/history${qs ? `?${qs}` : ""}`;


  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text().catch(()=>"");
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return res.json();
}
