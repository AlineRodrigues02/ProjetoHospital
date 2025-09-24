// src/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUser, ROLES } from "./auth.js";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(ROLES.ATENDENTE);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");
    if (!name.trim() || !username.trim() || !password) {
      setErr("Preencha todos os campos.");
      return;
    }
    if (password !== confirm) {
      setErr("As senhas não coincidem.");
      return;
    }
    try {
      await createUser({ name, username, role, password });
      setOk("Conta criada com sucesso! Você já pode entrar.");
      setTimeout(() => navigate("/login", { replace: true }), 800);
    } catch (e) {
      setErr(e.message || "Erro ao registrar.");
    }
  }

  return (
    <>
      {/* CSS da grid injetado diretamente no JSX */}
      <style>{`
        /* From Uiverse.io by Gautammsharma */
        .grid-wrapper {
          min-height: 100%;
          width: 100%;
          position: relative;
          background-color: #f8fafc;
        }

        .grid-background {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 0;
          background-image: linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px);
          background-size: 20px 30px;
          -webkit-mask-image: radial-gradient(
            ellipse 70% 60% at 50% 0%,
            #000 60%,
            transparent 100%
          );
          mask-image: radial-gradient(
            ellipse 70% 60% at 50% 0%,
            #000 60%,
            transparent 100%
          );
        }
      `}</style>

      <div className="grid-wrapper">
        <div className="grid-background"></div>

        <div className="grid min-h-screen place-items-center relative z-10 bg-slate-50">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow ring-1 ring-black/5"
          >
            <h1 className="text-lg font-bold text-slate-800">Registrar usuário</h1>
            <p className="mt-1 text-xs text-slate-500">
              Crie contas de <b>médico</b> ou <b>atendente</b>.
            </p>

            <label className="mt-4 block text-sm font-medium text-slate-700">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex.: Dra. Maria Lima"
            />

            <label className="mt-3 block text-sm font-medium text-slate-700">Usuário</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="ex.: maria.medico"
              autoComplete="username"
            />

            <label className="mt-3 block text-sm font-medium text-slate-700">Perfil</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value={ROLES.ATENDENTE}>Atendente</option>
              <option value={ROLES.MEDICO}>Médico</option>
            </select>

            <label className="mt-3 block text-sm font-medium text-slate-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="••••••••"
              autoComplete="new-password"
            />

            <label className="mt-3 block text-sm font-medium text-slate-700">Confirmar senha</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="••••••••"
              autoComplete="new-password"
            />

            {err && <div className="mt-2 text-sm text-red-600">{err}</div>}
            {ok && <div className="mt-2 text-sm text-emerald-700">{ok}</div>}

            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
            >
              Registrar
            </button>

            <div className="mt-3 text-center text-xs text-slate-600">
              Já tem conta?{" "}
              <Link to="/login" className="font-semibold text-indigo-700 hover:underline">
                Entrar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
