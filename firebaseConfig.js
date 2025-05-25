// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDMHvwmblXxtmssfZOiwFPkzs7nCC40qUU",
  authDomain: "lista-compras-2b820.firebaseapp.com",
  databaseURL: "https://lista-compras-2b820-default-rtdb.firebaseio.com",
  projectId: "lista-compras-2b820",
  storageBucket: "lista-compras-2b820.firebasestorage.app",
  messagingSenderId: "420137072954",
  appId: "1:420137072954:web:3588bed66b3cc0de547803"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const firebaseAuth = getAuth(app);