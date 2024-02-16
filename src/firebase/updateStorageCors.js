const admin = require("firebase-admin");
const firebaseConfig = require("../config");

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: firebaseConfig.REACT_APP_STORAGE_BUCKET,
});

// Set CORS configuration
const bucket = admin.storage().bucket();
const corsConfiguration = [
  {
    origin: ["http://localhost:3000"],
    method: ["GET", "PUT", "POST", "DELETE"],
    maxAgeSeconds: 3600,
  },
];

bucket
  .setCorsConfiguration(corsConfiguration)
  .then(() => {
    console.log("CORS configuration updated successfully");
  })
  .catch((error) => {
    console.error("Error updating CORS configuration:", error);
  });
