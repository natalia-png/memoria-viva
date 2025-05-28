import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function FamiliarDetalle() {
  const { id } = useParams();
  const [familiar, setFamiliar] = useState(null);

  useEffect(() => {
    const fetchFamiliar = async () => {
      const docRef = doc(db, "familiares", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFamiliar(docSnap.data());
      } else {
        setFamiliar(undefined);
      }
    };
    fetchFamiliar();
  }, [id]);

  if (familiar === undefined) return <p style={{ textAlign: "center" }}>Familiar no encontrado.</p>;
  if (!familiar) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>¿Quién soy yo?</h1>

      <img
        src={familiar.imagen}
        alt={familiar.nombre}
        style={{
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          objectFit: "cover",
          margin: "20px",
          border: "4px solid #81d4fa",
        }}
      />

      <h2>{familiar.nombre} - {familiar.relacion}</h2>

      <p style={{ fontSize: "18px", fontStyle: "italic", marginTop: "20px" }}>
        {familiar.descripcion}
      </p>

      <audio id="audio" src={familiar.audio}></audio>

      <button
  style={{
    marginTop: "20px",
    backgroundColor: "#ff7043",
    color: "white",
    fontSize: "18px",
    padding: "12px 24px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
  }}
  onClick={() => {
    if (familiar.audio) {
      const audio = new Audio(familiar.audio);
      audio.play();
    } else {
      const texto = `Soy ${familiar.nombre}, tu ${familiar.relacion}. ${familiar.descripcion}`;
      const speech = new SpeechSynthesisUtterance(texto);
      speech.lang = "es-ES";
      speechSynthesis.speak(speech);
    }
  }}
>
  🎧 Escuchar
</button>

    </div>
  );
}
