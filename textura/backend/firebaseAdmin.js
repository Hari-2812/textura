// backend/config/firebaseAdmin.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to service account file
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

// Load service account JSON
let serviceAccount;
try {
  const fileData = fs.readFileSync(serviceAccountPath, "utf8");
  serviceAccount = JSON.parse(fileData);
} catch (err) {
  console.error("❌ ERROR: Cannot load serviceAccountKey.json");
  console.error("Expected at:", serviceAccountPath);
  console.error(err);
  process.exit(1);
}

// Initialize Admin SDK (avoid duplicate initialization)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("🔥 Firebase Admin Initialized Successfully");
}

export default admin;
