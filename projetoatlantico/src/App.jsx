import { HashRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import TriageSystem from "./TriageSystem.jsx";
import DoctorPanel from "./DoctorPanel.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import History from "./History.jsx";
import DoctorLogin from "./DoctorLogin.jsx";
import AttendantLogin from "./AttendantLogin.jsx";
import { getCurrentUser, logout } from "./auth.js";


function RequireRoleWithFallback({ roles, fallback, children }) {
  const u = getCurrentUser();
  if (!u) return <Navigate to={fallback} replace />;
  if (roles && !roles.includes(u.role)) return <Navigate to="/" replace />;
  return children;
}

function TopNav() {
  const u = getCurrentUser();
  const navigate = useNavigate();
  function doLogout() { logout(); navigate("/", { replace: true }); }
  return (
    <div className="fixed right-4 top-4 z-50 flex gap-2">
      <Link to="/" className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow ring-1 ring-black/5 hover:bg-white">Início</Link>
      <Link to="/historico" className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow ring-1 ring-black/5 hover:bg-white">Histórico</Link>
      {u?.role === "ATENDENTE" && (
        <Link to="/atendente" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Triagem</Link>
      )}
      {u?.role === "MEDICO" && (
        <Link to="/medico" className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Painel do Médico</Link>
      )}
      {!u ? (
        <>
          <Link to="/atendente/login" className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900">Login Atendente</Link>
          <Link to="/medico/login" className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900">Login Médico</Link>
        </>
      ) : (
        <button onClick={doLogout} className="rounded-full bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300">
          Sair ({u.role.toLowerCase()})
        </button>
      )}
    </div>
  );
}

function HomeRedirect() {
  const u = getCurrentUser();
  if (!u) return <Navigate to="/atendente/login" replace />; // ou /medico/login, se preferir
  return <Navigate to={u.role === "ATENDENTE" ? "/atendente" : "/medico"} replace />;
}

export default function AppRouter() {
  return (
    <HashRouter>
      <TopNav />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        {/* logins */}
        <Route path="/atendente/login" element={<AttendantLogin />} />
        <Route path="/medico/login" element={<DoctorLogin />} />
        {/* (opcionais) login/registro antigos */}
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Register />} />

        {/* triagem: somente ATENDENTE */}
        <Route
          path="/atendente"
          element={
            <RequireRoleWithFallback roles={["ATENDENTE"]} fallback="/atendente/login">
              <TriageSystem />
            </RequireRoleWithFallback>
          }
        />

        {/* painel médico: somente MEDICO */}
        <Route
          path="/medico"
          element={
            <RequireRoleWithFallback roles={["MEDICO"]} fallback="/medico/login">
              <DoctorPanel />
            </RequireRoleWithFallback>
          }
        />

        {/* histórico: ambos */}
        <Route
          path="/historico"
          element={
            <RequireRoleWithFallback roles={["MEDICO","ATENDENTE"]} fallback="/atendente/login">
              <History />
            </RequireRoleWithFallback>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
