// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZXAZ7OIXvn8SryLC4dHdOXXWBGaud2d8",
  authDomain: "kavernakult.firebaseapp.com",
  projectId: "kavernakult",
  storageBucket: "kavernakult.firebasestorage.app",
  messagingSenderId: "706887446189",
  appId: "1:706887446189:web:df761539b165d1f06fe024",
  measurementId: "G-SHN2VJYY2P"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export {db, analytics, auth}

