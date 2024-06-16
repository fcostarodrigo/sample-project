import { PropsWithChildren } from "react";

import { NotificationPermissionRequest } from "./NotificationPermissionRequest";
import { ServiceWorkerCheck } from "./ServiceWorkerCheck";
import { WebPushNotificationCheck } from "./WebPushNotificationCheck";

export function WebPushNotificationSetup(props: PropsWithChildren) {
  return (
    <ServiceWorkerCheck>
      <WebPushNotificationCheck>
        <NotificationPermissionRequest>{props.children}</NotificationPermissionRequest>
      </WebPushNotificationCheck>
    </ServiceWorkerCheck>
  );
}
