import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZj9ND6yDvBJVgOn_gJzOw9z9EQk325y0",
  authDomain: "memoria-vivav2.firebaseapp.com",
  projectId: "memoria-vivav2",
  storageBucket: "memoria-vivav2.firebasestorage.app",
  messagingSenderId: "907283770605",
  appId: "1:907283770605:web:03c75b01ad4005527130e4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

