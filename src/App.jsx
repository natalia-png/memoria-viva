import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { requestFirebaseNotificationPermission } from "./firebase/firebaseMessaging";

import Familiares from "./pages/Familiares";
import FamiliarDetalle from "./pages/FamiliarDetalle";
import SubirInformacion from "./pages/SubirInformacion";
import EditarFamiliar from "./pages/EditarFamiliar";
import Historias from "./pages/Historias";
import QuienSoy from "./pages/QuienSoy";
import EditarPerfil from "./pages/EditarPerfil";
import Recordatorios from "./pages/Recordatorios";
import ReconocimientoVoz from "./pages/ReconocimientoVoz"; // si lo usas solo como página
import ControlVoz from "./pages/ControlVoz"; // página para control con comandos

function App() {
  useEffect(() => {
    requestFirebaseNotificationPermission();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Familiares />} />
        <Route path="/familiar/:id" element={<FamiliarDetalle />} />
        <Route path="/subir" element={<SubirInformacion />} />
        <Route path="/editar/:id" element={<EditarFamiliar />} />
        <Route path="/historias" element={<Historias />} />
        <Route path="/quien-soy" element={<QuienSoy />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        <Route path="/recordatorios" element={<Recordatorios />} />
         {/* Ruta para solo probar el reconocimiento */}
        <Route path="/reconocimiento" element={<ReconocimientoVoz />} />

        {/* Ruta para control por voz con navegación */}
        <Route path="/control-voz" element={<ControlVoz />} />
      </Routes>
    </Router>
  );
}

export default App;
