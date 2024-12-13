import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDOhTyqCjU0fXFHIYrtXQ0Uhh6K2wJhe1c",
    authDomain: "hotel-management-db2db.firebaseapp.com",
    projectId: "hotel-management-db2db",
    storageBucket: "hotel-management-db2db.appspot.com",
    messagingSenderId: "800386319704",
    appId: "1:800386319704:web:766d409954763c514a512d",
    measurementId: "G-EF5TCCNSYN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Messaging instance
const messaging = getMessaging(app);

export { messaging };

