import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export default function EditarPerfil() {
  const [descripcion, setDescripcion] = useState("");
  const [fotoActual, setFotoActual] = useState("");
  const [nuevaFoto, setNuevaFoto] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const docRef = doc(db, "perfil", "usuarioPrincipal");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setDescripcion(data.descripcion || "");
          setFotoActual(data.foto || "");
        }
      } catch (err) {
        console.error("Error al cargar perfil", err);
      }
    };
    obtenerPerfil();
  }, []);

  const hablar = () => {
    const speech = new SpeechSynthesisUtterance(descripcion);
    speech.lang = "es-ES";
    speechSynthesis.speak(speech);
  };

  const guardarCambios = async () => {
    setLoading(true);
    try {
      let urlFoto = fotoActual;

      if (nuevaFoto) {
        const imgRef = ref(storage, `perfil/${uuidv4()}-${nuevaFoto.name}`);
        await uploadBytes(imgRef, nuevaFoto);
        urlFoto = await getDownloadURL(imgRef);
      }

      await setDoc(doc(db, "perfil", "usuarioPrincipal"), {
        descripcion,
        foto: urlFoto
      });

      setMensaje("✅ Perfil actualizado correctamente");
    } catch (err) {
      console.error("Error al guardar", err);
      setMensaje("❌ Error al guardar perfil");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "420px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ color: "#1565c0", marginBottom: "20px" }}>Editar Perfil</h1>

      {fotoActual && (
        <img
          src={fotoActual}
          alt="Foto actual"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            marginBottom: "15px"
          }}
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setNuevaFoto(e.target.files[0])}
        style={{ marginBottom: "15px" }}
      />

      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción de la persona"
        style={{
          width: "100%",
          height: "100px",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
          marginBottom: "10px"
        }}
      />

      <button
        onClick={hablar}
        style={{
          backgroundColor: "#0288d1",
          color: "white",
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          marginBottom: "15px",
          cursor: "pointer"
        }}
      >
        🗣️ Leer en voz alta
      </button>

      <br />

      <button
        onClick={guardarCambios}
        disabled={loading}
        style={{
          backgroundColor: "#4caf50",
          color: "white",
          padding: "12px 24px",
          fontSize: "16px",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          width: "100%"
        }}
      >
        {loading ? "Guardando..." : "💾 Guardar Cambios"}
      </button>

      {mensaje && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: mensaje.includes("✅") ? "#c8e6c9" : "#ffcdd2",
            color: mensaje.includes("✅") ? "#2e7d32" : "#b71c1c",
            borderRadius: "8px",
            fontWeight: "bold"
          }}
        >
          {mensaje}
        </div>
      )}
    </div>
  );
}
