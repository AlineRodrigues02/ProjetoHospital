import { HashRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import MedicalLanding from "./MedicalLanding.jsx";
import TriageSystem from "./TriageSystem.jsx";
import DoctorPanel from "./DoctorPanel.jsx";
import DoctorLogin from "./DoctorLogin.jsx";

// wrapper simples de proteção
function RequireDoctor({ children }) {
  const ok = sessionStorage.getItem("doctorAuth") === "ok";
  return ok ? children : <Navigate to="/medico/login" replace />;
}

export default function AppRouter() {
  return (
    <HashRouter>
      <div className="fixed right-4 top-4 z-50 flex gap-2">
        <Link to="/" className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow ring-1 ring-black/5 hover:bg-white">Home</Link>
        <Link to="/sistema" className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700">Sistema</Link>
        <Link to="/medico" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700">Painel Médico</Link>
      </div>

      <Routes>
        <Route path="/" element={<MedicalLanding />} />
        <Route path="/sistema" element={<TriageSystem />} />
        <Route path="/medico/login" element={<DoctorLogin />} />
        <Route
          path="/medico"
          element={
            <RequireDoctor>
              <DoctorPanel />
            </RequireDoctor>
          }
        />
      </Routes>
    </HashRouter>
  );
}
