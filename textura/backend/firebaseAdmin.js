import admin from "firebase-admin";

let firebaseAdmin = null;
let firebaseAdminError = "FIREBASE_SERVICE_ACCOUNT is not configured.";

const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

if (rawServiceAccount) {
  try {
    const serviceAccount = JSON.parse(rawServiceAccount);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    firebaseAdmin = admin;
    firebaseAdminError = "";
  } catch (error) {
    firebaseAdminError = `Invalid FIREBASE_SERVICE_ACCOUNT JSON: ${error.message}`;
    console.error("❌ Firebase Admin initialization failed:", firebaseAdminError);
  }
} else {
  console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT is not set. Firebase auth routes will return 503 until it is added.");
}

export const isFirebaseConfigured = Boolean(firebaseAdmin);
export const getFirebaseAdminError = () => firebaseAdminError;

export default firebaseAdmin;
