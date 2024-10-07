import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyClQZIikkLudpWobELGzIue3GlJUdQBrko",
    authDomain: "orderly-80ffe.firebaseapp.com",
    projectId: "orderly-80ffe",
    storageBucket: "orderly-80ffe.appspot.com",
    messagingSenderId: "47869944438",
    appId: "1:47869944438:web:720be144670caebb97b557"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export { analytics, firestore, auth, storage }