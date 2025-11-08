const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://ecomap-85618.firebasestorage.app',
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, bucket, db };
