// Firebase z CDN – funguje na GitHub Pages
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔑 TVŮJ KONFIG (TEN UŽ MÁŠ SPRÁVNĚ)
const firebaseConfig = {
  apiKey: "AIzaSyCmX8ULiP3A1oT1ZqmIF3tyVpIUfUfm954",
  authDomain: "harmonogram-prace.firebaseapp.com",
  projectId: "harmonogram-prace",
  storageBucket: "harmonogram-prace.firebasestorage.app",
  messagingSenderId: "377582148460",
  appId: "1:377582148460:web:2ede9bbe55c25c1c227149"
};

// Inicializace Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Firestore databáze
export const db = getFirestore(app);
