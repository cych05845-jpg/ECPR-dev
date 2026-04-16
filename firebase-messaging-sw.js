// Firebase Cloud Messaging Service Worker
// 放在 GitHub repo 根目錄，檔名必須是 firebase-messaging-sw.js

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

// 背景推播處理（網頁關閉時也能收到）
messaging.onBackgroundMessage(payload => {
  console.log('[FCM SW] Background message:', payload);
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'ECPR 通知', {
    body: body || '',
    icon: icon || '/ECPR/icon.png',
    badge: '/ECPR/icon.png',
    tag: payload.data?.caseId || 'ecpr',
    data: payload.data || {},
    actions: [
      { action: 'open', title: '📋 前往任務頁' },
      { action: 'dismiss', title: '關閉' }
    ],
    requireInteraction: true  // 通知不自動消失
  });
});

// 點擊通知處理
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  
  const url = 'https://cych05845-jpg.github.io/ECPR/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // 如果網頁已開啟，切換到它
      for (const client of clientList) {
        if (client.url.includes('cych05845-jpg.github.io') && 'focus' in client) {
          return client.focus();
        }
      }
      // 否則開啟新視窗
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
