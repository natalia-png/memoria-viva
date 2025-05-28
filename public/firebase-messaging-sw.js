importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCZj9ND6yDvBJVgOn_gJzOw9z9EQk325y0",
  authDomain: "memoria-vivav2.firebaseapp.com",
  projectId: "memoria-vivav2",
  storageBucket: "memoria-vivav2.firebasestorage.app",
  messagingSenderId: "907283770605",
  appId: "1:907283770605:web:03c75b01ad4005527130e4"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png', // ajusta la ruta según tu proyecto

  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
