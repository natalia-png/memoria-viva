// src/firebase/firestoreHelpers.js
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // Ajusta este path si tu archivo config tiene otro nombre o ubicación

export const saveTokenToFirestore = async (token) => {
  if (!token) return;

  try {
    await setDoc(doc(db, "tokens", token), {
      token: token,
      createdAt: new Date(),
    });
    console.log("Token guardado en Firestore");
  } catch (error) {
    console.error("Error guardando token en Firestore", error);
  }
};
