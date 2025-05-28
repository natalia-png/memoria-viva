import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css'; // 🔁 ESTA LÍNEA ES CLAVE

import { VoiceControlProvider } from './context/VoiceControlContext';

// Registrar Service Worker para Firebase Messaging
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then(registration => {
        console.log('Service Worker registrado con éxito:', registration);
      }).catch(err => {
        console.log('Error al registrar Service Worker:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <VoiceControlProvider>
      <App />
    </VoiceControlProvider>
  </React.StrictMode>
);
