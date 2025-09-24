// src/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "./auth.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const u = await login(username, password);
      if (u.role === "MEDICO") navigate("/medico", { replace: true });
      else navigate("/atendente", { replace: true });
    } catch (e) {
      setErr(e.message || "Falha no login.");
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
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow ring-1 ring-black/5"
          >
            <h1 className="text-lg font-bold text-slate-800">Entrar</h1>
            <p className="mt-1 text-xs text-slate-500">Use seu usuário e senha.</p>

            <label className="mt-4 block text-sm font-medium text-slate-700">Usuário</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="ex.: joao.medico"
              autoComplete="username"
            />

            <label className="mt-3 block text-sm font-medium text-slate-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              autoComplete="current-password"
            />

            {err && <div className="mt-2 text-sm text-red-600">{err}</div>}

            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
            >
              Entrar
            </button>

            <div className="mt-3 text-center text-xs text-slate-600">
              Não tem conta?{" "}
              <Link to="/registrar" className="font-semibold text-indigo-700 hover:underline">
                Registrar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
