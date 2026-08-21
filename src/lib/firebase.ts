import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDNHPm_yasNRpqTsjSMDElztbpaxSpSplw",
  authDomain: "prep-track-os.firebaseapp.com",
  databaseURL: "https://prep-track-os-default-rtdb.firebaseio.com",
  projectId: "prep-track-os",
  storageBucket: "prep-track-os.firebasestorage.app",
  messagingSenderId: "379968268199",
  appId: "1:379968268199:web:8d2d16d9a0d3e7991bf882",
  measurementId: "G-Q47P53S1B5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const firestore = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
