import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDovV-spuggUOdwQPPIhJa28avr2THdZTk",
  authDomain: "ecommercestore-7733c.firebaseapp.com",
  databaseURL: "https://ecommercestore-7733c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ecommercestore-7733c",
  storageBucket: "ecommercestore-7733c.appspot.com",
  messagingSenderId: "342851368891",
  appId: "1:342851368891:web:7b19ea17be2a6b1b9db69e",
  measurementId: "G-9D05LX75XZ"
};

const app = initializeApp(firebaseConfig);
console.log("app is initialized")
const analytics = getAnalytics(app);
const auth = getAuth(app);
const rtdb = getDatabase(app);
const fsdb = getFirestore(app);

console.log("firestore is initialized")

const storage = getStorage(app);

export {auth, rtdb, fsdb, storage}