import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export default function EditarFamiliar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [familiar, setFamiliar] = useState(null);
  const [nombre, setNombre] = useState("");
  const [relacion, setRelacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [nuevoAudio, setNuevoAudio] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const obtenerFamiliar = async () => {
      try {
        const docRef = doc(db, "familiares", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFamiliar(data);
          setNombre(data.nombre);
          setRelacion(data.relacion);
          setDescripcion(data.descripcion);
        } else {
          setError(true);
          setMensaje("Familiar no encontrado.");
        }
      } catch (err) {
        console.error(err);
        setError(true);
        setMensaje("Error al cargar los datos.");
      }
    };

    obtenerFamiliar();
  }, [id]);

  const handleActualizar = async () => {
    if (!nombre || !relacion || !descripcion) {
      setMensaje("Por favor completa todos los campos.");
      setError(true);
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const docRef = doc(db, "familiares", id);
      const updates = {
        nombre,
        relacion,
        descripcion,
      };

      // Subir nueva imagen si se seleccionó
      if (nuevaImagen) {
        const imgRef = ref(storage, `fotos/${uuidv4()}-${nuevaImagen.name}`);
        await uploadBytes(imgRef, nuevaImagen);
        const nuevaURL = await getDownloadURL(imgRef);
        updates.imagen = nuevaURL;
      }

      // Subir nuevo audio si se seleccionó
      if (nuevoAudio) {
        const audioRef = ref(storage, `audios/${uuidv4()}-${nuevoAudio.name}`);
        await uploadBytes(audioRef, nuevoAudio);
        const nuevaURL = await getDownloadURL(audioRef);
        updates.audio = nuevaURL;
      }

      await updateDoc(docRef, updates);

      setMensaje("✅ Datos actualizados correctamente.");
      setError(false);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al actualizar.");
      setError(true);
    }

    setLoading(false);
  };

  if (!familiar) {
    return <p style={{ textAlign: "center", padding: "20px" }}>Cargando...</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "420px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Editar Familiar</h1>

      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
        style={inputStyle}
      />

      <input
        type="text"
        value={relacion}
        onChange={(e) => setRelacion(e.target.value)}
        placeholder="Relación"
        style={inputStyle}
      />

      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción"
        style={{ ...inputStyle, height: "80px" }}
      />

      {/* Imagen actual y nueva */}
      <label><b>Foto actual:</b></label>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <img
          src={familiar.imagen}
          alt="foto actual"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
      </div>
      <input type="file" accept="image/*" onChange={(e) => setNuevaImagen(e.target.files[0])} />

      {/* Audio actual y nuevo */}
      <label style={{ marginTop: "10px", display: "block" }}><b>Audio actual:</b></label>
      <audio controls style={{ width: "100%" }}>
        <source src={familiar.audio} type="audio/mp3" />
        Tu navegador no soporta audio.
      </audio>
      <input type="file" accept="audio/*" onChange={(e) => setNuevoAudio(e.target.files[0])} />

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
        onClick={handleActualizar}
        style={buttonStyle}
        disabled={loading}
      >
        {loading ? "Actualizando..." : "GUARDAR CAMBIOS"}
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
  backgroundColor: "#ff9800",
  color: "white",
  fontSize: "18px",
  padding: "12px",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
};
