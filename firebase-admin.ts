import { initializeApp, getApps, App, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
const service_key = require("@/service-key.json");

let app: App;
if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(service_key),
  });
} else {
  app = getApp();
}

const adminDB = getFirestore(app);

export { app as adminApp, adminDB };
