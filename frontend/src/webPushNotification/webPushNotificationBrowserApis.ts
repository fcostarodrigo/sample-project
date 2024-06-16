export function getNotificationPermission() {
  return Notification.permission;
}

export function hasPushNotification() {
  return "PushManager" in window;
}

export function hasServiceWorker() {
  return "serviceWorker" in navigator;
}

export function requestNotificationPermission() {
  return Notification.requestPermission();
}

export async function getWebPushNotificationSubscription() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  return subscription;
}

export async function subscribeWebPushNotification() {
  const registration = await navigator.serviceWorker.ready;
  return await registration.pushManager.subscribe({
    applicationServerKey: import.meta.env.VITE_WEB_PUSH_NOTIFICATION_PUBLIC_KEY,
    userVisibleOnly: true,
  });
}

export function addServiceWorkerMessageListener(listener: (message: MessageEvent<string>) => void) {
  navigator.serviceWorker.addEventListener("message", listener);
}
