import React, { useState } from "react";
import { db, storage } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export default function SubirInformacion() {
  const [nombre, setNombre] = useState("");
  const [relacion, setRelacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenFile, setImagenFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);

  const handleGuardar = async () => {
    if (!nombre || !relacion || !descripcion || !imagenFile) {
  setMensaje("❗ Nombre, relación, descripción e imagen son obligatorios.");
  setError(true);
  return;
}


    setLoading(true);
    setMensaje("");

    try {
      // Subir imagen
      const imagenRef = ref(storage, `fotos/${uuidv4()}-${imagenFile.name}`);
      await uploadBytes(imagenRef, imagenFile);
      const imagenURL = await getDownloadURL(imagenRef);

      // Subir audio
      let audioURL = null;
if (audioFile) {
  const audioRef = ref(storage, `audios/${uuidv4()}-${audioFile.name}`);
  await uploadBytes(audioRef, audioFile);
  audioURL = await getDownloadURL(audioRef);
}


      // Guardar en Firestore
      await addDoc(collection(db, "familiares"), {
  nombre,
  relacion,
  descripcion,
  imagen: imagenURL,
  ...(audioURL && { audio: audioURL }), // Solo si hay audio
});


      setMensaje("✅ Familiar guardado correctamente");
      setError(false);

      // Limpiar campos
      setNombre("");
      setRelacion("");
      setDescripcion("");
      setImagenFile(null);
      setAudioFile(null);
    } catch (error) {
      console.error("Error al guardar: ", error);
      setMensaje("❌ Hubo un error al guardar");
      setError(true);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "420px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Cargar Información</h1>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="Relación (ej: hija)"
        value={relacion}
        onChange={(e) => setRelacion(e.target.value)}
        style={inputStyle}
      />

      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        style={{ ...inputStyle, height: "80px" }}
      />

      <label><b>Selecciona una foto:</b></label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImagenFile(e.target.files[0])}
        style={{ marginBottom: "10px" }}
      />

      <label><b>Selecciona un audio:</b></label>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudioFile(e.target.files[0])}
      />

      {mensaje && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: error ? "#ffcdd2" : "#c8e6c9",
            color: error ? "#b71c1c" : "#2e7d32",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {mensaje}
        </div>
      )}

      <button
        onClick={handleGuardar}
        style={buttonStyle}
        disabled={loading}
      >
        {loading ? "Guardando..." : "SUBIR INFORMACIÓN"}
      </button>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  marginTop: "20px",
  width: "100%",
  backgroundColor: "#ff7043",
  color: "white",
  fontSize: "18px",
  padding: "12px",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
};
