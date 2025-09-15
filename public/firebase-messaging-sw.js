/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB1e_nM-v-G5EYZSrXjElyHo61I4qb5rNc",
  authDomain: "mycarbuddycustomer.firebaseapp.com",
  databaseURL: "https://mycarbuddycustomer-default-rtdb.firebaseio.com",
  projectId: "mycarbuddycustomer",
  storageBucket: "mycarbuddycustomer.firebasestorage.app",
  messagingSenderId: "98137449003",
  appId: "1:98137449003:web:f14e6f91c0126ef8f8806e",
  measurementId: "G-QG1DR5TCZN"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const { title, body, icon, image, click_action } = payload.notification || {};
  const notificationTitle = title || 'Notification';
  const notificationOptions = {
    body: body || '',
    icon: icon || '/favicon.png',
    image: image,
    data: { click_action }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const target = event.notification?.data?.click_action || '/';
  // Set flag for background notification
  localStorage.setItem('notificationReceived', 'true');
  event.waitUntil(self.clients.openWindow(target));
});
