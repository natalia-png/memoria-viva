// src/firebase/ReconocimientoVoz.jsx
import React, { useEffect, useState } from "react";

const ReconocimientoVoz = ({ onComando }) => {
  const [escuchando, setEscuchando] = useState(false);
  const [textoReconocido, setTextoReconocido] = useState("");

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "es-ES";

    recognition.onstart = () => {
      setEscuchando(true);
    };

    recognition.onresult = (event) => {
      const resultado = event.results[0][0].transcript;
      setTextoReconocido(resultado);
      if (onComando) onComando(resultado);
    };

    recognition.onerror = (event) => {
      console.error("Error en reconocimiento de voz:", event.error);
      setEscuchando(false);
    };

    recognition.onend = () => {
      setEscuchando(false);
    };

    // Función para iniciar reconocimiento
    const startRecognition = () => {
      if (!escuchando) {
        recognition.start();
      }
    };

    // Exponer startRecognition para que el usuario pueda iniciar escucha con botón
    window.startReconocimientoVoz = startRecognition;

    // Cleanup
    return () => {
      recognition.stop();
    };
  }, [escuchando, onComando]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onClick={() => window.startReconocimientoVoz()}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "10px",
          border: "none",
          backgroundColor: escuchando ? "#e53935" : "#4caf50",
          color: "white",
          cursor: "pointer",
        }}
      >
        {escuchando ? "Escuchando..." : "Hablar"}
      </button>

      {textoReconocido && (
        <p style={{ marginTop: "10px", fontStyle: "italic" }}>Reconocido: {textoReconocido}</p>
      )}
    </div>
  );
};

export default ReconocimientoVoz;
