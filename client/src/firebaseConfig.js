// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
console.log(import.meta.env.VITE_FIREBASE_API_KEY);

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "plantebuy.firebaseapp.com",
  projectId: "plantebuy",
  storageBucket: "plantebuy.appspot.com",
  messagingSenderId: "838242196697",
  appId: "1:838242196697:web:2e92f61b4825dfbb2832c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
