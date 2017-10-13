import * as admin from "firebase-admin";
import config from "./main";
import * as dotenv from "dotenv";

dotenv.config();
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIALS)),
    databaseURL: "https://eksi-bot.firebaseio.com"
  });

export default admin;