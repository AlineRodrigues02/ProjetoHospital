
// src/data.js
export const PATIENTS_KEY = "patients";
export const HISTORY_KEY = "history";

export function loadPatients() {
  try { return JSON.parse(localStorage.getItem(PATIENTS_KEY) || "[]"); }
  catch { return []; }
}
export function savePatients(p) {
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(p));
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
    const pa = COLOR_INFO[a.color].priority;
    const pb = COLOR_INFO[b.color].priority;
    if (pb !== pa) return pb - pa; // vermelho > amarelo > verde
    return a.createdAt - b.createdAt;
  });
}
