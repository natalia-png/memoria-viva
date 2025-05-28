const functions = require("firebase-functions");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
admin.initializeApp();

exports.enviarRecordatorioPush = onDocumentCreated("recordatorios/{recordatorioId}", async (event) => {
  const recordatorio = event.data;

  if (!recordatorio) {
    console.log("No se encontró dato de recordatorio");
    return null;
  }

  const tokensSnapshot = await admin.firestore().collection("tokens").get();
  const tokens = tokensSnapshot.docs.map(doc => doc.id);

  if (tokens.length === 0) {
    console.log("No hay tokens para enviar notificaciones");
    return null;
  }

  const payload = {
    notification: {
      title: recordatorio.titulo && recordatorio.titulo.trim() !== "" ? recordatorio.titulo : "Recordatorio",
      body: recordatorio.descripcion || "¡Tienes un recordatorio!",
      sound: "default",
    },
  };

  try {
    const response = await admin.messaging().sendToDevice(tokens, payload);
    console.log("Notificación enviada con éxito:", response);
  } catch (error) {
    console.error("Error enviando notificación:", error);
  }

  return null;
});
