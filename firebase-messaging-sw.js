importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBO_-bLFvbkodDLmnZBGRIMJ_ODYDt65BM",
  authDomain: "ecpr-push.firebaseapp.com",
  projectId: "ecpr-push",
  storageBucket: "ecpr-push.firebasestorage.app",
  messagingSenderId: "624087518261",
  appId: "1:624087518261:web:fb0392ad20888a604c757c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = (payload.notification && payload.notification.title) || 'ECPR 通知';
  const body = (payload.notification && payload.notification.body) || '';
  self.registration.showNotification(title, {
    body: body,
    icon: '/ECPR-dev/icon.png',
    tag: (payload.data && payload.data.caseId) || 'ecpr',
    data: payload.data || {},
    requireInteraction: true
  });
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = 'https://cych05845-jpg.github.io/ECPR-dev/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url.includes('ECPR-dev') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
