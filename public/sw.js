// Service Worker for Push Notifications
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '새 문의사항이 등록되었습니다';
  const options = {
    body: data.body || '문의하기 페이지에서 확인해주세요.',
    icon: '/icon-192x192.png', // 아이콘 파일이 있다면
    badge: '/badge-72x72.png',
    tag: 'inquiry-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: '확인하기'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/admin/inquiries')
    );
  }
});

