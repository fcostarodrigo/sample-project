import { type PropsWithChildren } from "react";

import { NotificationCheck } from "./notification-check";
import { NotificationPermissionRequest } from "./notification-permission-request";
import { ServiceWorkerCheck } from "./service-worker-check";

export function NotificationSetup(props: PropsWithChildren) {
  return (
    <ServiceWorkerCheck>
      <NotificationCheck>
        <NotificationPermissionRequest>{props.children}</NotificationPermissionRequest>
      </NotificationCheck>
    </ServiceWorkerCheck>
  );
}
