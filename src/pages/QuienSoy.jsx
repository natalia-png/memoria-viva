import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function QuienSoy() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const docRef = doc(db, "perfil", "usuarioPrincipal");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPerfil(docSnap.data());
        } else {
          setPerfil(null);
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        setPerfil(null);
      }
      setLoading(false);
    };

    cargarPerfil();
  }, []);

  const hablar = () => {
    if (perfil?.descripcion) {
      const speech = new SpeechSynthesisUtterance(perfil.descripcion);
      speech.lang = "es-ES";
      speechSynthesis.speak(speech);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Cargando...</p>;
  }

  if (!perfil) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <p>No hay información cargada todavía.</p>
        <button
          onClick={() => navigate("/editar-perfil")}
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ✏️ Crear perfil
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", textAlign: "center", maxWidth: "420px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "26px", color: "#1565c0", marginBottom: "20px" }}>
        ¿Quién soy yo?
      </h1>

      {perfil?.foto && (
        <img
          src={perfil.foto}
          alt="Foto del usuario"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            marginBottom: "20px",
            objectFit: "cover"
          }}
        />
      )}

      <p
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          fontStyle: "italic",
          lineHeight: "1.6",
          color: "#333",
          marginBottom: "20px"
        }}
      >
        {perfil.descripcion}
      </p>

      <button
        onClick={hablar}
        style={{
          backgroundColor: "#ef5350",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "10px",
          fontSize: "16px",
          cursor: "pointer",
          marginRight: "10px",
        }}
      >
        🗣️ Escuchar
      </button>

      <button
        onClick={() => navigate("/editar-perfil")}
        style={{
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "10px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        ✏️ Editar
      </button>
    </div>
  );
}
