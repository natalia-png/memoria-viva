import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function Recordatorios() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [recordatorios, setRecordatorios] = useState([]);

  // Pedir permiso para notificaciones
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const q = query(collection(db, "recordatorios"), orderBy("fechaHora"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecordatorios(data);
    });
    return () => unsub();
  }, []);

  const mostrarNotificacion = (titulo, descripcion) => {
    if (Notification.permission === "granted") {
      new Notification(titulo, {
        body: descripcion,
        icon: "/favicon.ico",
      });
    }
  };

  // Revisar recordatorios cada minuto para notificar
  useEffect(() => {
    const interval = setInterval(() => {
      const ahora = new Date();
      recordatorios.forEach(async (r) => {
        const fechaRecordatorio = r.fechaHora.toDate
          ? r.fechaHora.toDate()
          : new Date(r.fechaHora);

        if (
          Math.abs(ahora - fechaRecordatorio) < 60000 &&
          !r.notificado
        ) {
          mostrarNotificacion(r.titulo, r.descripcion || "");
          // Marcar como notificado para no repetir
          const docRef = doc(db, "recordatorios", r.id);
          await updateDoc(docRef, { notificado: true });
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [recordatorios]);

  const guardarRecordatorio = async () => {
    if (!titulo || !fechaHora) {
      alert("Por favor completa el título y la fecha/hora");
      return;
    }
    try {
      await addDoc(collection(db, "recordatorios"), {
        titulo,
        descripcion,
        fechaHora: new Date(fechaHora),
        notificado: false, // campo para controlar notificaciones
      });
      setTitulo("");
      setDescripcion("");
      setFechaHora("");
    } catch (error) {
      alert("Error al guardar recordatorio");
    }
  };

  const eliminarRecordatorio = async (id) => {
    try {
      await deleteDoc(doc(db, "recordatorios", id));
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "420px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Recordatorios</h1>

      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        style={inputStyle}
      />
      <input
        type="datetime-local"
        value={fechaHora}
        onChange={(e) => setFechaHora(e.target.value)}
        style={inputStyle}
      />
      <textarea
        placeholder="Descripción (opcional)"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        style={{ ...inputStyle, height: "80px" }}
      />

      <button onClick={guardarRecordatorio} style={buttonStyle}>
        Agregar recordatorio
      </button>

      <hr style={{ margin: "20px 0" }} />

      <h2>Próximos recordatorios</h2>

      {recordatorios.length === 0 && <p>No hay recordatorios aún.</p>}

      {recordatorios.map((r) => (
        <div key={r.id} style={recordStyle}>
          <strong>{r.titulo}</strong> <br />
          <small>{new Date(r.fechaHora.seconds * 1000).toLocaleString()}</small>
          <p>{r.descripcion}</p>
          <button onClick={() => eliminarRecordatorio(r.id)} style={btnDelete}>
            Eliminar
          </button>
        </div>
      ))}
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
  backgroundColor: "#0288d1",
  color: "white",
  fontSize: "18px",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
};

const recordStyle = {
  backgroundColor: "#f0f4f8",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "12px",
};

const btnDelete = {
  backgroundColor: "#e53935",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "6px",
};
