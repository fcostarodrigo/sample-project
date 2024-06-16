import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

import { PersistentAlert } from "../components/PersistentAlert";
import { hasPushNotification } from "./webPushNotificationBrowserApis";

export function WebPushNotificationCheck(props: PropsWithChildren) {
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
