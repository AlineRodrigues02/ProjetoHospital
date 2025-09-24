// src/History.jsx
import { useEffect, useMemo, useState } from "react";
import { loadHistory } from "./data.js";

function formatDate(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleString();
}
function minutes(ms) {
  return (ms / 60000).toFixed(1);
}

export default function History() {
  const [all, setAll] = useState(loadHistory());
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("Concluído");

  useEffect(() => {
    function onStorage(e) {
      if (e.key === "history") {
        try { setAll(JSON.parse(e.newValue || "[]")); } catch {}
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filtered = useMemo(() => {
    const n = name.trim().toLowerCase();
    const fromTs = from ? new Date(from + "T00:00:00").getTime() : null;
    const toTs = to ? new Date(to + "T23:59:59").getTime() : null;
    return all.filter(r => {
      if (n && !r.name.toLowerCase().includes(n)) return false;
      const keyTs = r.startedAt || r.createdAt || 0;
      if (fromTs && keyTs < fromTs) return false;
      if (toTs && keyTs > toTs) return false;
      if (status && r.status !== status) return false;
      return true;
    }).sort((a,b)=> (a.startedAt||a.createdAt||0) - (b.startedAt||b.createdAt||0));
  }, [all, name, from, to, status]);

  const stats = useMemo(() => {
    const byDoctor = {};
    const byPriority = { vermelho: 0, amarelo: 0, verde: 0 };
    let waits = [];
    for (const r of filtered) {
      byDoctor[r.attendedBy || "—"] = (byDoctor[r.attendedBy || "—"] || 0) + 1;
      byPriority[r.color] = (byPriority[r.color] || 0) + 1;
      if (r.startedAt && r.createdAt) waits.push(r.startedAt - r.createdAt);
    }
    const avgWaitMs = waits.length ? waits.reduce((a,b)=>a+b,0) / waits.length : 0;
    return { byDoctor, byPriority, avgWaitMinutes: Number(minutes(avgWaitMs)) };
  }, [filtered]);

  function download(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportJSON() {
    const payload = { generatedAt: new Date().toISOString(), total: filtered.length, stats, records: filtered };
    download("relatorio.json", JSON.stringify(payload, null, 2), "application/json");
  }
  function exportCSV() {
    const lines = [];
    lines.push("=== Estatísticas ===");
    lines.push("Pacientes por médico:");
    for (const [k,v] of Object.entries(stats.byDoctor)) lines.push(`${k};${v}`);
    lines.push("");
    lines.push("Contagem por prioridade:");
    for (const [k,v] of Object.entries(stats.byPriority)) lines.push(`${k};${v}`);
    lines.push("");
    lines.push(`Tempo médio de espera (min);${stats.avgWaitMinutes}`);
    lines.push("");
    lines.push("=== Registros ===");
    lines.push("nome;motivo;triagem;medico;inicio;fim;espera(min)");
    for (const r of filtered) {
      const wait = r.startedAt && r.createdAt ? minutes(r.startedAt - r.createdAt) : "";
      lines.push([r.name, r.reason||"", r.color, r.attendedBy||"", formatDate(r.startedAt), formatDate(r.endedAt), wait].map(v=>String(v).replaceAll(";", ",")).join(";"));
    }
    download("relatorio.csv", lines.join("\n"), "text/csv");
  }

  return (
    <>
      {/* Grid de fundo igual ao TriageSystem */}
      <style>{`
        .grid-wrapper {
          min-height: 100vh;
          width: 100%;
          background-color: #f8fcfaff;
          background-image:
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px);
          background-size: 20px 30px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
      `}</style>

      <div className="grid-wrapper">
        <div className="relative z-10 mx-auto w-full max-w-6xl p-4">
          <h1 className="mb-4 text-2xl font-bold text-slate-800">Histórico de Pacientes</h1>

          {/* Filtros */}
          <div className="mb-4 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow ring-1 ring-black/5 md:grid-cols-12">
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-slate-700">Nome do paciente</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Buscar por nome" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700">De</label>
              <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700">Até</label>
              <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select value={status} onChange={e=>setStatus(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="Concluído">Concluído</option>
                <option value="">Todos</option>
              </select>
            </div>
          </div>

          {/* Ações de exportação */}
          <div className="mb-3 flex gap-2">
            <button onClick={exportJSON} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900">Exportar JSON</button>
            <button onClick={exportCSV} className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-300">Exportar CSV</button>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto rounded-2xl bg-white shadow ring-1 ring-black/5">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Paciente</th>
                  <th className="px-4 py-3">Motivo</th>
                  <th className="px-4 py-3">Triagem</th>
                  <th className="px-4 py-3">Médico</th>
                  <th className="px-4 py-3">Início</th>
                  <th className="px-4 py-3">Fim</th>
                  <th className="px-4 py-3">Espera (min)</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} className={i % 2 ? "bg-white" : "bg-slate-50/30"}>
                    <td className="px-4 py-2 font-medium text-slate-800">{r.name}</td>
                    <td className="px-4 py-2 text-slate-700">{r.reason || "—"}</td>
                    <td className="px-4 py-2 capitalize">{r.color}</td>
                    <td className="px-4 py-2">{r.attendedBy || "—"}</td>
                    <td className="px-4 py-2">{formatDate(r.startedAt)}</td>
                    <td className="px-4 py-2">{formatDate(r.endedAt)}</td>
                    <td className="px-4 py-2">{r.startedAt && r.createdAt ? minutes(r.startedAt - r.createdAt) : "—"}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-slate-500">Nenhum registro encontrado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
