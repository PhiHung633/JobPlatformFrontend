// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.20.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.20.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDOhTyqCjU0fXFHIYrtXQ0Uhh6K2wJhe1c",
    authDomain: "hotel-management-db2db.firebaseapp.com",
    projectId: "hotel-management-db2db",
    storageBucket: "hotel-management-db2db.appspot.com",
    messagingSenderId: "800386319704",
    appId: "1:800386319704:web:766d409954763c514a512d",
    measurementId: "G-EF5TCCNSYN"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
