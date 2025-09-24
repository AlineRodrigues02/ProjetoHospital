// src/TriageSystem.jsx
import { useEffect, useMemo, useState } from "react";
import { COLOR_INFO } from "./data.js";
import { getCurrentUser } from "./auth.js";
import { Patients } from "./api.js";

export default function TriageSystem() {
  const user = getCurrentUser();
  const isAttendant = user?.role === "ATENDENTE";

  const [name, setName] = useState("");
  const [reason, setReason] = useState("");

  const [queue, setQueue] = useState([]);       // TRIAGEM
  const [inService, setInService] = useState(); // ATENDIMENTO

  // carrega periodicamente
  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const triage = await Patients.list("TRIAGEM");
        const attending = await Patients.list("ATENDIMENTO");
        if (!alive) return;
        setQueue(triage);
        setInService(attending[0]);
      } catch {}
    }
    load();
    const id = setInterval(load, 1000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const stats = useMemo(() => {
    const s = { total: (queue?.length || 0) + (inService ? 1 : 0), vermelho: 0, amarelo: 0, verde: 0 };
    for (const v of queue) s[v.color.toLowerCase()] += 1;
    if (inService) s[inService.color.toLowerCase()] += 1;
    return s;
  }, [queue, inService]);

  async function addPatient(e) {
    e?.preventDefault?.();
    if (!isAttendant || !name.trim()) return;
    await Patients.create(name.trim(), reason.trim());
    setName(""); setReason("");
  }

  return (
    <>
      {/* CSS embutido do background grid */}
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
        <div className="relative z-10 min-h-screen bg-slate-50 w-full max-w-6xl p-4">
          <h1 className="mb-4 text-2xl font-bold text-slate-800">Painel do Atendente</h1>

          {isAttendant && (
            <form onSubmit={addPatient} className="mb-6 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow ring-1 ring-black/5 md:grid-cols-12">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700">Nome</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="Paciente"
                />
              </div>
              <div className="md:col-span-7">
                <label className="block text-sm font-medium text-slate-700">Motivo</label>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="Ex.: febre, queda..."
                />
              </div>
              <div className="md:col-span-2 flex items-end">
                <button type="submit" className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white">
                  Adicionar
                </button>
              </div>
            </form>
          )}

          {/* Cards de contagem */}
          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
            {["vermelho","amarelo","verde"].map(c => (
              <div key={c} className={`rounded-2xl ${COLOR_INFO[c].bg} p-4`}>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${COLOR_INFO[c].dot}`} />
                  <span className={`text-sm font-semibold ${COLOR_INFO[c].text}`}>{COLOR_INFO[c].label}</span>
                </div>
                <div className="mt-1 text-xs text-slate-600">{COLOR_INFO[c].desc}</div>
                <div className="mt-2 text-2xl font-bold text-slate-800">
                  {c === "vermelho" ? stats.vermelho : c === "amarelo" ? stats.amarelo : stats.verde}
                </div>
              </div>
            ))}
            <div className="rounded-2xl bg-slate-100 p-4">
              <div className="text-sm font-semibold text-slate-700">Total</div>
              <div className="mt-2 text-2xl font-bold text-slate-800">{stats.total}</div>
            </div>
          </div>

          {/* Em atendimento e fila */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
              <h2 className="mb-2 text-sm font-semibold text-slate-700">Em atendimento</h2>
              {inService ? <PatientCard p={inService} /> : (
                <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
                  Ninguém em atendimento
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5 md:col-span-2">
              <h2 className="mb-2 text-sm font-semibold text-slate-700">Fila</h2>
              <ul className="space-y-2">
                {queue.map(v => <li key={v.id}><PatientCard p={v} /></li>)}
                {queue.length === 0 && (
                  <li className="rounded-xl border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500">
                    Sem pacientes
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PatientCard({ p }) {
  const ci = COLOR_INFO[p.color.toLowerCase()];
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-3">
        <span className={`h-2 w-2 rounded-full ${ci.dot}`} />
        <div>
          <div className="text-sm font-semibold text-slate-800">{p.patient?.name || p.name}</div>
          <div className="text-xs text-slate-500">
            {ci.label} • {p.reason || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
