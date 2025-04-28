import { type PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

import { PersistentAlert } from "../components/persistent-alert";
import { hasServiceWorker } from "./notification-browser-api";

export function ServiceWorkerCheck(props: PropsWithChildren) {
  const { t } = useTranslation();

  if (!hasServiceWorker()) {
    return (
      <PersistentAlert
        body={t("This app can only be used in browsers that have service worker functionality.")}
        header={t("Service worker not available")}
      />
    );
  }

  return props.children;
}
