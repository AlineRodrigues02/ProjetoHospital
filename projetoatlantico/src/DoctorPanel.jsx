import { useEffect, useState } from "react";
import { COLOR_INFO } from "./data.js";
import { Patients } from "./api.js";
import { getCurrentUser } from "./auth.js";

export default function DoctorPanel() {
  const user = getCurrentUser(); // { id, name, role: "MEDICO" }
  const [queue, setQueue] = useState([]);      // TRIAGEM
  const [inService, setInService] = useState();// ATENDIMENTO

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
    const id = setInterval(load, 800);
    return () => { alive = false; clearInterval(id); };
  }, []);

  async function startVisit(v) {
    await Patients.start(v.id, user.id);
  }
  async function finishVisit(v) {
    await Patients.finish(v.id);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl p-4">
        <h1 className="mb-4 text-2xl font-bold text-slate-800">Painel do Médico</h1>

        {/* Em atendimento */}
        <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Em atendimento</h2>
          </div>

          {inService ? (
            <PatientRow
              p={inService}
              actions={<button onClick={()=>finishVisit(inService)} className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">Concluir</button>}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
              Ninguém em atendimento
            </div>
          )}
        </div>

        {/* Fila */}
        <div className="mt-4 rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          <h2 className="mb-2 text-sm font-semibold text-slate-700">Fila</h2>
          <ul className="space-y-2">
            {queue.map(v => (
              <li key={v.id}>
                <PatientRow
                  p={v}
                  actions={<button onClick={()=>startVisit(v)} className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">Iniciar</button>}
                />
              </li>
            ))}
            {queue.length === 0 && (
              <li className="rounded-xl border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500">
                Sem pacientes na fila
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PatientRow({ p, actions }) {
  const ci = COLOR_INFO[p.color.toLowerCase()];
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-3">
        <span className={`h-2 w-2 rounded-full ${ci.dot}`} />
        <div>
          <div className="text-sm font-semibold text-slate-800">{p.patient?.name || p.name}</div>
          <div className="text-xs text-slate-500">{ci.label} • {p.reason || "—"}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
}
