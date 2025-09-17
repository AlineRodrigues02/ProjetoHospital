// src/DoctorLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorLogin() {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (pass === "1234") {
      sessionStorage.setItem("doctorAuth", "ok"); // sessão do médico
      navigate("/medico", { replace: true });
    } else {
      setErr("Senha inválida.");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5"
      >
        <h1 className="text-xl font-extrabold text-slate-900">Login do Médico</h1>
        <p className="mt-1 text-sm text-slate-600">Digite a senha para acessar o painel.</p>

        <label className="mt-4 block text-sm font-medium text-slate-700">Senha</label>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="••••"
        />

        {err && <div className="mt-2 text-sm text-red-600">{err}</div>}

        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
