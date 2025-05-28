// src/firebase/firebaseMessaging.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { saveTokenToFirestore } from "./firestoreHelpers"; // Asegúrate de tener este archivo y función

const firebaseConfig = {
  apiKey: "AIzaSyCZj9ND6yDvBJVgOn_gJzOw9z9EQk325y0",
  authDomain: "memoria-vivav2.firebaseapp.com",
  projectId: "memoria-vivav2",
  storageBucket: "memoria-vivav2.firebasestorage.app",
  messagingSenderId: "907283770605",
  appId: "1:907283770605:web:03c75b01ad4005527130e4"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Messaging
const messaging = getMessaging(app);

// Función para pedir permiso y obtener token, y guardarlo en Firestore
export const requestFirebaseNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BJavXyXkhWQX44C8-u_eO6TpDe7CSZ-dG29l9olPVE4dZ9sjrr20cm9Q0TDKxiKyYSlIeMXZDaSmS6qnEqproSI"
      });
      if (token) {
        await saveTokenToFirestore(token);
      }
      return token;
    } else {
      console.log("Permiso de notificaciones denegado");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener token", error);
    return null;
  }
};

// Escuchar mensajes cuando la app está en primer plano
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
