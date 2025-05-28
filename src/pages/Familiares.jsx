import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useVoiceControl } from "../context/VoiceControlContext";
import { FiMic, FiMicOff, FiArrowLeft } from "react-icons/fi"; // iconos

export default function Familiares() {
  const [familiares, setFamiliares] = React.useState([]);
  const navigate = useNavigate();

  const { listening, transcript, startListening, stopListening } = useVoiceControl();

 useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "familiares"), (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFamiliares(data);
  });

  return () => unsubscribe();
}, []);

useEffect(() => {
  if (!transcript) return;

  const texto = transcript.toLowerCase();

  if (texto.includes("agregar familiar")) {
    navigate("/subir"); // sin replace
    stopListening();
  } else if (texto.includes("ver recuerdos")) {
    navigate("/historias");
    stopListening();
  } else if (texto.includes("quien soy yo") || texto.includes("quién soy yo")) {
    navigate("/quien-soy");
    stopListening();
  } else if (texto.includes("recordatorios")) {
    navigate("/recordatorios");
    stopListening();
  }
}, [transcript, navigate, stopListening]);


// Nuevo efecto para manejar historial en localhost
useEffect(() => {
  if (window.history.length <= 1) {
    navigate("/", { replace: true });
  }
}, []);


  const handleEliminar = async (id) => {
    const confirm = window.confirm("¿Estás seguro de que deseas eliminar este familiar?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "familiares", id));
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("❌ No se pudo eliminar. Intenta de nuevo.");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto", position: "relative" }}>
      {/* Barra superior con íconos */}
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          display: "flex",
          gap: 20,
          zIndex: 1000,
          alignItems: "center",
        }}
      >
        {/* Icono volver */}
        <FiArrowLeft
          size={28}
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
          title="Volver"
          aria-label="Volver"
        />

        {/* Icono micrófono */}
        {listening ? (
          <FiMicOff
            size={28}
            style={{ cursor: "pointer", color: "#d32f2f" }}
            onClick={stopListening}
            title="Detener reconocimiento de voz"
            aria-label="Detener reconocimiento de voz"
          />
        ) : (
          <FiMic
            size={28}
            style={{ cursor: "pointer", color: "#0288d1" }}
            onClick={startListening}
            title="Activar reconocimiento de voz"
            aria-label="Activar reconocimiento de voz"
          />
        )}
      </div>

      <h1 style={{ fontSize: 28, textAlign: "center", marginBottom: 30, color: "#01579b" }}>
        Memoria Viva
      </h1>

      {familiares.map((familiar) => (
        <div
          key={familiar.id}
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <img
            src={familiar.imagen}
            alt={familiar.nombre}
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderRadius: "50%",
              marginBottom: 10,
              border: "2px solid #81d4fa",
            }}
          />
          <h2 style={{ margin: "10px 0", fontSize: 20, color: "#0277bd" }}>
            {familiar.nombre} - {familiar.relacion}
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate(`/familiar/${familiar.id}`)}
              style={btn("info")}
            >
              Ver
            </button>
            <button
              onClick={() => navigate(`/editar/${familiar.id}`)}
              style={btn("edit")}
            >
              Editar
            </button>
            <button
              onClick={() => handleEliminar(familiar.id)}
              style={btn("delete")}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 30,
        }}
      >
        <button onClick={() => navigate("/subir")} style={botonGrande("green")}>
          ➕ Agregar Familiar
        </button>

        <button
          onClick={() => navigate("/historias")}
          style={botonGrande("blue")}
        >
          📸 Ver Recuerdos
        </button>

        <button
          onClick={() => navigate("/quien-soy")}
          style={botonGrande("orange")}
        >
          🙋 ¿Quién soy yo?
        </button>

        <button
          onClick={() => navigate("/recordatorios")}
          style={{
            backgroundColor: "#0288d1",
            color: "white",
            fontSize: 16,
            padding: 10,
            borderRadius: 10,
            border: "none",
            width: "100%",
            marginTop: 10,
          }}
        >
          🕒 Recordatorios
        </button>
      </div>

      {transcript && (
        <p
          style={{
            marginTop: 40,
            fontStyle: "italic",
            color: "#555",
            textAlign: "center",
          }}
          aria-live="polite"
        >
          Texto reconocido: "{transcript}"
        </p>
      )}
    </div>
  );
}

const btn = (type) => {
  const base = {
    color: "white",
    fontSize: 14,
    padding: "8px 14px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  };

  const colors = {
    info: { backgroundColor: "#0288d1" },
    edit: { backgroundColor: "#f9a825" },
    delete: { backgroundColor: "#d32f2f" },
  };

  return { ...base, ...colors[type] };
};

const botonGrande = (color) => {
  const base = {
    color: "white",
    fontSize: 16,
    padding: 14,
    borderRadius: 10,
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  };

  const colors = {
    green: { backgroundColor: "#43a047" },
    blue: { backgroundColor: "#0288d1" },
    orange: { backgroundColor: "#fb8c00" },
  };

  return { ...base, ...colors[color] };
};
