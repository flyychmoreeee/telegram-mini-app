// Import Firebase scripts dengan versi yang kompatibel
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase dengan konfigurasi yang benar
firebase.initializeApp({
  apiKey: 'AIzaSyCMXLskwGBi9FnPKIZYsBAMcQ0q2oiUN-M',
  appId: '1:16643742210:web:deb438f33c808ccd45251b',
  messagingSenderId: '16643742210',
  projectId: 'sis-absensi-23e84',
  authDomain: 'sis-absensi-23e84.firebaseapp.com',
  storageBucket: 'sis-absensi-23e84.firebasestorage.app',
  measurementId: 'G-17BGV5BS1N',
});

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification?.title || 'SIS Absensi';
  const notificationOptions = {
    body: payload.notification?.body || 'Anda memiliki notifikasi baru',
    icon: '/icons/Icon-192.png',
    badge: '/icons/Icon-192.png',
    tag: payload.data?.type || 'default',
    data: payload.data,
    requireInteraction: true,
    actions: payload.data?.type === 'lesson_reminder' ? [
      {
        action: 'open_app',
        title: 'Absen Sekarang'
      }
    ] : []
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click received.');
  
  event.notification.close();
  
  // Handle different actions
  if (event.action === 'open_app') {
    // Open app with specific route
    event.waitUntil(
      clients.openWindow('/')
    );
  } else {
    // Default action - just open the app
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then(function(clientList) {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
    );
  }
});
