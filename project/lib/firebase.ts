import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAgv8_a0nXwx7G-Pd2JbQQyABND2R96QYk",
  authDomain: "web-extension-app.firebaseapp.com",
  databaseURL: "https://web-extension-app-default-rtdb.firebaseio.com/",
  projectId: "web-extension-app",
  storageBucket: "web-extension-app.firebasestorage.app",
  messagingSenderId: "815821572313",
  appId: "1:815821572313:web:2e50c9dddd50d94d0796c8",
  measurementId: "G-JTSYL83CSN",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const database = getDatabase(app) // Realtime Database
export const storage = getStorage(app)

export default app
