// src/AttendantLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setCurrentUser } from "./auth.js";
import { Auth } from "./api.js";

export default function AttendantLogin() {
  const [username, setUsername] = useState("atendente.demo");
  const [password, setPassword] = useState("123");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const u = await Auth.login(username, password); // retorna {id,name,username,role:"ATENDENTE"}
      setCurrentUser(u);
      navigate("/atendente", { replace: true });
    } catch (e) {
      setErr("Falha no login: " + e.message);
    }
  }

  return (
    <>
      {/* CSS embutido do background grid */}
      <style>{`
        .grid-wrapper {
          min-height: 100vh;
          width: 100%;
          background-color: #37824539;
          background-image:
            linear-gradient(to right, #0fba5421 1px, transparent 1px),
            linear-gradient(to bottom, #0c926122 1px, transparent 1px);
          background-size: 20px 30px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <div className="grid-wrapper">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl bg-white p-6 shadow ring-1 ring-black/5"
        >
          <h1 className="text-lg font-bold text-slate-800">Login do Atendente</h1>

          <label className="mt-3 block text-sm font-medium text-slate-700">Usuário</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="mt-3 block text-sm font-medium text-slate-700">Senha</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err && <div className="mt-2 text-sm text-red-600">{err}</div>}

          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white"
          >
            Entrar
          </button>

          <div className="mt-3 text-center text-xs text-slate-600">
            <Link
              to="/medico/login"
              className="font-semibold text-indigo-700 hover:underline"
            >
              Sou médico
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
