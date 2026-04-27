export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  await navigator.serviceWorker.register('/sw.js');
  return true;
};

export const askNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return 'unsupported' as const;
  }

  const permission = await Notification.requestPermission();
  return permission;
};

export const triggerReminderNotification = async () => {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) {
    throw new Error('Notifications are not supported in this browser.');
  }

  if (Notification.permission !== 'granted') {
    throw new Error('Notification permission has not been granted yet.');
  }

  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification('Medication Reminder', {
    body: 'Ava Thompson has a blood pressure follow-up due at 8:00 PM.',
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: 'medication-reminder'
  });
};
