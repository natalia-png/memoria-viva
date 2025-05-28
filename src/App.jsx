import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { requestFirebaseNotificationPermission, onMessageListener } from "./firebase/firebaseMessaging";

import Familiares from "./pages/Familiares";
import FamiliarDetalle from "./pages/FamiliarDetalle";
import SubirInformacion from "./pages/SubirInformacion";
import EditarFamiliar from "./pages/EditarFamiliar";
import Historias from "./pages/Historias";
import QuienSoy from "./pages/QuienSoy";
import EditarPerfil from "./pages/EditarPerfil";
import Recordatorios from "./pages/Recordatorios";
import ReconocimientoVoz from "./pages/ReconocimientoVoz";
import ControlVoz from "./pages/ControlVoz";

function App() {
  useEffect(() => {
    requestFirebaseNotificationPermission();

    // Escuchar notificaciones en primer plano
    onMessageListener()
      .then(payload => {
        alert(`Notificación: ${payload.notification.title}\n${payload.notification.body}`);
      })
      .catch(err => console.log("Error escuchando mensajes: ", err));
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
        <Route path="/reconocimiento" element={<ReconocimientoVoz />} />
        <Route path="/control-voz" element={<ControlVoz />} />
      </Routes>
    </Router>
  );
}

export default App;
