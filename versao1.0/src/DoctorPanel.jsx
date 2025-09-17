// src/DoctorPanel.jsx
import { useEffect, useMemo, useState } from "react";

function loadPatients() {
  try { return JSON.parse(localStorage.getItem("patients") || "[]"); }
  catch { return []; }
}
function savePatients(p) {
  localStorage.setItem("patients", JSON.stringify(p));
}

export default function DoctorPanel() {
  const [patients, setPatients] = useState(loadPatients());

  // Mantém sincronizado com a tela de triagem (mesmo localStorage)
  useEffect(() => {
    const onStorage = () => setPatients(loadPatients());
    window.addEventListener("storage", onStorage);
    const id = setInterval(() => setPatients(loadPatients()), 800); // polling leve
    return () => { window.removeEventListener("storage", onStorage); clearInterval(id); };
  }, []);

  useEffect(() => { savePatients(patients); }, [patients]);

  const inService = patients.find(p => p.status === "Em atendimento");
  const queue = patients
    .filter(p => p.status === "Em triagem" || p.status === "Em fila")
    .sort((a, b) => a.createdAt - b.createdAt); // já chega priorizado pela triagem

  const stats = useMemo(() => ({
    triagem: patients.filter(p => p.status === "Em triagem").length,
    fila: patients.filter(p => p.status === "Em fila").length,
    atendimento: patients.filter(p => p.status === "Em atendimento").length,
    concluidos: patients.filter(p => p.status === "Concluído").length,
  }), [patients]);

  function finishCurrent() {
    setPatients(prev => {
      const tmp = prev.map(p => p.status === "Em atendimento" ? { ...p, status: "Concluído" } : p);
      const nextIdx = tmp.findIndex(p => p.status === "Em triagem");
      if (nextIdx >= 0) tmp[nextIdx] = { ...tmp[nextIdx], status: "Em atendimento" };
      savePatients(tmp);
      return tmp;
    });
  }

  function startPatient(id) {
    setPatients(prev => {
      // garante apenas 1 em atendimento
      const cleared = prev.map(p => p.status === "Em atendimento" ? { ...p, status: "Em triagem" } : p);
      const tmp = cleared.map(p => p.id === id ? { ...p, status: "Em atendimento" } : p);
      savePatients(tmp);
      return tmp;
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Painel do Médico</h1>
        <p className="mt-1 text-sm text-slate-600">Veja o atendimento atual e os próximos da fila.</p>

        {/* Status */}
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Badge color="indigo">Em atendimento: {stats.atendimento}</Badge>
          <Badge color="amber">Em triagem: {stats.triagem}</Badge>
          <Badge color="slate">Em fila: {stats.fila}</Badge>
          <Badge color="emerald">Concluídos: {stats.concluidos}</Badge>
        </div>

        {/* Atual */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h2 className="text-lg font-bold text-slate-900">Atendimento atual</h2>
          {!inService ? (
            <div className="mt-2 text-sm text-slate-600">Nenhum paciente em atendimento.</div>
          ) : (
            <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 p-4">
              <div>
                <div className="text-base font-semibold text-slate-900">{inService.name}</div>
                <div className="text-xs text-slate-600">{inService.reason}</div>
                <div className="mt-1 text-xs font-medium text-slate-700">
                  Cor: {inService.color} • Status: {inService.status}
                </div>
              </div>
              <button
                onClick={finishCurrent}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Finalizar atendimento
              </button>
            </div>
          )}
        </section>

        {/* Próximos */}
        <section className="mt-6">
          <h2 className="text-lg font-bold text-slate-900">Próximos</h2>
          <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            {queue.slice(0, 8).map(p => (
              <li key={p.id} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-600">{p.reason}</div>
                    <div className="mt-1 text-xs font-medium text-slate-700">Status: {p.status} • Cor: {p.color}</div>
                  </div>
                  <button
                    onClick={() => startPatient(p.id)}
                    className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                  >
                    Iniciar
                  </button>
                </div>
              </li>
            ))}
            {queue.length === 0 && (
              <li className="rounded-xl border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500">
                Sem pacientes
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Badge({ children, color = "slate" }) {
  const map = {
    emerald: "bg-emerald-100 text-emerald-700",
    indigo: "bg-indigo-100 text-indigo-700",
    slate: "bg-slate-100 text-slate-700",
    amber: "bg-amber-100 text-amber-700",
  };
  return <span className={`rounded-full px-3 py-1 ${map[color]} text-xs font-semibold`}>{children}</span>;
}
