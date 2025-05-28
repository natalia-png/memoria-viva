// src/pages/ControlVoz.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import ReconocimientoVoz from "./ReconocimientoVoz";

export default function ControlVoz() {
  const navigate = useNavigate();

  // Función para manejar el texto reconocido por voz
  const manejarComando = (texto) => {
    const comando = texto.toLowerCase();

    if (comando.includes("agregar familiar")) {
      navigate("/subir");
    } else if (comando.includes("ver recuerdos")) {
      navigate("/historias");
    } else if (comando.includes("quién soy yo") || comando.includes("quien soy yo")) {
      navigate("/quien-soy");
    } else if (comando.includes("recordatorios")) {
      navigate("/recordatorios");
    } else {
      alert(`No entendí el comando: "${texto}"`);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "480px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Control por Voz</h1>
      <p style={{ textAlign: "center" }}>
        Habla claramente y di comandos como "Agregar familiar", "Ver recuerdos", "Quién soy yo" o "Recordatorios"
      </p>

      {/* Pasa la función manejarComando como prop para que ReconocimientoVoz la llame */}
      <ReconocimientoVoz onComando={manejarComando} />
    </div>
  );
}
