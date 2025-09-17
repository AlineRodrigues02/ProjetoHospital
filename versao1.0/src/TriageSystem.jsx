import { useEffect, useMemo, useState } from "react";

const COLOR_INFO = {
  vermelho: { label: "Vermelho", desc: "Urgente — imediato", bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", priority: 3 },
  amarelo:  { label: "Amarelo",  desc: "Moderado — espera média", bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500", priority: 2 },
  verde:    { label: "Verde",    desc: "Leve — pode esperar", bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", priority: 1 },
};

// classificador simples por palavras-chave
function triageColor(text) {
  const t = (text || "").toLowerCase();
  if (/parada|inconsciente|sangramento|dor\s*forte|urgente|falta de ar|desmaio/.test(t)) return "vermelho";
  if (/febre|fratura|queda|tontura|moderado|vômito|diarreia/.test(t)) return "amarelo";
  return "verde";
}

function orderQueue(arr) {
  return [...arr].sort((a, b) => {
    const pa = COLOR_INFO[a.color].priority;
    const pb = COLOR_INFO[b.color].priority;
    if (pb !== pa) return pb - pa;          // prioridade: vermelho > amarelo > verde
    return a.createdAt - b.createdAt;       // FIFO dentro da mesma cor
  });
}

export default function TriageSystem() {
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");

  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem("patients");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  function addPatient(e) {
    e?.preventDefault();
    if (!name.trim() || !reason.trim()) return;
    const color = triageColor(reason);
    const p = {
      id: crypto.randomUUID(),
      name: name.trim(),
      reason: reason.trim(),
      color,
      status: "Em fila", // estados: Em fila | Em triagem | Em atendimento | Concluído
      createdAt: Date.now(),
    };
    setPatients(prev => orderQueue([...prev, p]));
    setName("");
    setReason("");
  }

  function callNext() {
    setPatients(prev => {
      // Finaliza quem estava em atendimento (se houver)
      const done = prev.map(p => (p.status === "Em atendimento" ? { ...p, status: "Concluído" } : p));
      // Pega o próximo em fila respeitando a prioridade
      const nextIdx = orderQueue(done).findIndex(p => p.status === "Em fila");
      if (nextIdx >= 0) done[nextIdx] = { ...done[nextIdx], status: "Em atendimento" };
      return orderQueue(done);
    });
  }

  const startService = (id) =>
    setPatients(prev => prev.map(p => (p.id === id ? { ...p, status: "Em atendimento" } : p)));

  const finishService = (id) =>
    setPatients(prev => {
      const tmp = prev.map(p => (p.id === id ? { ...p, status: "Concluído" } : p));
      // Chamada automática do próximo se ninguém estiver em atendimento
      if (!tmp.some(p => p.status === "Em atendimento")) {
        const nextIdx = orderQueue(tmp).findIndex(p => p.status === "Em fila");
        if (nextIdx >= 0) tmp[nextIdx] = { ...tmp[nextIdx], status: "Em atendimento" };
      }
      return orderQueue(tmp);
    });

  const resetQueue = () => setPatients([]);

  const stats = useMemo(
    () => ({
      fila: patients.filter(p => p.status === "Em fila").length,
      atendimento: patients.filter(p => p.status === "Em atendimento").length,
      concluidos: patients.filter(p => p.status === "Concluído").length,
    }),
    [patients]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Sistema de Triagem</h1>
        <p className="mt-1 text-sm text-slate-600">
          Cadastre pacientes, classifique automaticamente e gerencie a fila por prioridade.
        </p>

        {/* Formulário */}
        <form onSubmit={addPatient} className="mt-6 grid grid-cols-1 gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:grid-cols-3">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nome do paciente"
            className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Motivo da visita"
            className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">
            Cadastrar
          </button>
          <div className="md:col-span-3 text-xs text-slate-500">
            A cor de triagem é atribuída automaticamente por palavras-chave (pode editar o motivo para mudar a cor).
          </div>
        </form>

        {/* Ações rápidas e status */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button onClick={callNext} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Atender Próximo
          </button>
          <button onClick={resetQueue} className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300">
            Limpar Fila
          </button>
          <div className="ml-auto flex gap-3 text-sm">
            <Badge color="emerald">Em fila: {stats.fila}</Badge>
            <Badge color="indigo">Em atendimento: {stats.atendimento}</Badge>
            <Badge color="slate">Concluídos: {stats.concluidos}</Badge>
          </div>
        </div>

        {/* Colunas por cor (prioridade) */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {["vermelho", "amarelo", "verde"].map(col => (
            <div key={col} className={`rounded-2xl p-4 ${COLOR_INFO[col].bg} ring-1 ring-black/5`}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${COLOR_INFO[col].dot}`} />
                <h3 className={`text-lg font-bold ${COLOR_INFO[col].text}`}>{COLOR_INFO[col].label}</h3>
                <span className="ml-2 text-xs text-slate-600">{COLOR_INFO[col].desc}</span>
              </div>

              <ul className="space-y-3">
                {patients.filter(p => p.color === col).map(p => (
                  <li key={p.id} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{p.name}</div>
                        <div className="text-xs text-slate-600">{p.reason}</div>
                        <div className="mt-1 text-xs font-medium text-slate-700">Status: {p.status}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {p.status === "Em fila" && (
                          <button
                            onClick={() => startService(p.id)}
                            className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                          >
                            Iniciar
                          </button>
                        )}
                        {p.status === "Em atendimento" && (
                          <button
                            onClick={() => finishService(p.id)}
                            className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            Finalizar
                          </button>
                        )}
                        <button
                          onClick={() => printCard(p)}
                          className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300"
                        >
                          Imprimir ficha
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
                {patients.filter(p => p.color === col).length === 0 && (
                  <li className="rounded-xl border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500">
                    Sem pacientes
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Badge({ children, color = "slate" }) {
  const map = {
    emerald: "bg-emerald-100 text-emerald-700",
    indigo: "bg-indigo-100 text-indigo-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return <span className={`rounded-full px-3 py-1 ${map[color]} text-xs font-semibold`}>{children}</span>;
}

function printCard(p) {
  const w = window.open("", "PRINT", "height=500,width=700");
  w.document.write(`<html><head><title>Ficha — ${p.name}</title></head><body style="font-family:system-ui;padding:24px">`);
  w.document.write(`<h2>Ficha de Atendimento</h2>`);
  w.document.write(`<p><b>Nome:</b> ${p.name}</p>`);
  w.document.write(`<p><b>Motivo:</b> ${p.reason}</p>`);
  w.document.write(`<p><b>Triagem:</b> ${p.color}</p>`);
  w.document.write(`<p><b>Status:</b> ${p.status}</p>`);
  w.document.write(`</body></html>`);
  w.document.close();
  w.focus();
  w.print();
  w.close();
}
