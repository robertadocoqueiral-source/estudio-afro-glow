import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAkceeP5ei1prwgkuVE9bwfEiQnEyTrzzI",
  authDomain: "afro-glow-agendamento.firebaseapp.com",
  projectId: "afro-glow-agendamento",
  storageBucket: "afro-glow-agendamento.firebasestorage.app",
  messagingSenderId: "643687078835",
  appId: "1:643687078835:web:d9f7915884908a2641c9c6"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);