export function addServiceWorkerMessageListener(listener: (message: MessageEvent<string>) => void) {
  navigator.serviceWorker.addEventListener("message", listener);
}

export function getNotificationPermission() {
  return Notification.permission;
}

export async function getSubscriptionParams() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  return subscription;
}

export function hasPushNotification() {
  return "PushManager" in globalThis;
}

export function hasServiceWorker() {
  return "serviceWorker" in navigator;
}

export function requestNotificationPermission() {
  return Notification.requestPermission();
}

export async function subscribePushNotification() {
  const registration = await navigator.serviceWorker.ready;

  return await registration.pushManager.subscribe({
    applicationServerKey: import.meta.env.VITE_NOTIFICATION_PUBLIC_KEY,
    userVisibleOnly: true,
  });
}
