import { type PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

import { PersistentAlert } from "../components/persistent-alert";
import { hasPushNotification } from "./notification-browser-api";

export function NotificationCheck(props: PropsWithChildren) {
  const { t } = useTranslation();

  if (!hasPushNotification()) {
    return (
      <PersistentAlert
        body={t("This app can only be used in browsers that have web push notification functionality.")}
        header={t("Push notification not available")}
      />
    );
  }

  return props.children;
}
