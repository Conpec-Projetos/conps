import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBx9JNDGIFUjrWuGZKSVgqFZz9Yez4XAv8",
  authDomain: "planejador-de-ps.firebaseapp.com",
  projectId: "planejador-de-ps",
  storageBucket: "planejador-de-ps.firebasestorage.app",
  messagingSenderId: "794579358544",
  appId: "1:794579358544:web:ae3157244b91fa2e7cd255",
  measurementId: "G-5W3PRR4TTD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app); // TODO: ver se é necessário

export { db };
