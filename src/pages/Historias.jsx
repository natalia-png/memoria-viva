import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase/config";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";

export default function Historias() {
  const [imagenFile, setImagenFile] = useState(null);
  const [historia, setHistoria] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const [historias, setHistorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const q = query(collection(db, "historias"), orderBy("fecha", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistorias(data);
    });
    return () => unsub();
  }, []);

  const handleGuardar = async () => {
    if (!historia || !imagenFile) {
      setMensaje("❗ Por favor completa la historia y selecciona una imagen.");
      setError(true);
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const imgRef = ref(storage, `historias/${uuidv4()}-${imagenFile.name}`);
      await uploadBytes(imgRef, imagenFile);
      const imgURL = await getDownloadURL(imgRef);

      await addDoc(collection(db, "historias"), {
        historia,
        imagen: imgURL,
        fecha: new Date(),
        imagenPath: imgRef.fullPath
      });

      setMensaje("✅ Historia guardada correctamente");
      setError(false);
      setHistoria("");
      setImagenFile(null);
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al guardar historia");
      setError(true);
    }

    setLoading(false);
  };

  const leerHistoria = (texto) => {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-ES";
    speechSynthesis.speak(utterance);
  };

  const eliminarHistoria = async (id, imagenPath) => {
    const confirmar = window.confirm("¿Eliminar esta historia?");
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "historias", id));

      if (imagenPath) {
        const imgRef = ref(storage, imagenPath);
        await deleteObject(imgRef);
      }

      setMensaje("🗑️ Historia eliminada");
      setError(false);
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al eliminar historia");
      setError(true);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "420px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Álbum de Recuerdos
      </h1>

      <textarea
        placeholder="Escribe aquí la historia o recuerdo..."
        value={historia}
        onChange={(e) => setHistoria(e.target.value)}
        style={{
          width: "100%",
          height: "80px",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImagenFile(e.target.files[0])}
        style={{ marginTop: "10px" }}
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
            fontWeight: "bold"
          }}
        >
          {mensaje}
        </div>
      )}

      <button
        onClick={handleGuardar}
        style={{
          marginTop: "20px",
          width: "100%",
          backgroundColor: "#4caf50",
          color: "white",
          fontSize: "18px",
          padding: "12px",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer"
        }}
        disabled={loading}
      >
        {loading ? "Guardando..." : "SUBIR HISTORIA"}
      </button>

      <hr style={{ margin: "30px 0" }} />

      <input
        type="text"
        placeholder="Buscar en recuerdos..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <h2 style={{ textAlign: "center" }}>Recuerdos Guardados</h2>

      <AnimatePresence>
        {historias
          .filter((item) =>
            item.historia.toLowerCase().includes(busqueda.toLowerCase())
          )
          .map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                marginBottom: "20px",
                textAlign: "center",
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "12px",
                backgroundColor: "#fafafa"
              }}
            >
              <img
                src={item.imagen}
                alt="recuerdo"
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  marginBottom: "10px"
                }}
              />
              <p style={{ fontSize: "16px", fontStyle: "italic" }}>
                {item.historia}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px"
                }}
              >
                <button
                  onClick={() => leerHistoria(item.historia)}
                  style={{
                    backgroundColor: "#2196f3",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  🗣️ Leer
                </button>
                <button
                  onClick={() =>
                    eliminarHistoria(item.id, item.imagenPath)
                  }
                  style={{
                    backgroundColor: "#e53935",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
