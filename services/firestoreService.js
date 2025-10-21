const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'ecomap-85618.appspot.com',
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, bucket, db };
