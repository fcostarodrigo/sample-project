import { Text } from "@chakra-ui/react";
import { PropsWithChildren, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { OkAlert } from "../components/OkAlert";
import {
  useNotificationPermission,
  useRequestNotificationPermission,
  useSubscribeWebPushNotification,
} from "./webPushNotificationHooks";

function AlertBody(props: { isSubscribing: boolean; permission: NotificationPermission | undefined }) {
  const { t } = useTranslation();

  if (props.permission !== "denied") {
    return <Text>{t("This app needs notification to show messages from other users.")}</Text>;
  }

  if (props.isSubscribing) {
    return <Text>{t("Subscribing to notifications...")}</Text>;
  }

  return (
    <>
      <Text>{t("This app needs notification to show messages from other users.")}</Text>
      <Text>{t("Please, unblock notifications in your browser settings to use the application.")}</Text>
    </>
  );
}

export function NotificationPermissionRequest(props: PropsWithChildren) {
  const { t } = useTranslation();
  const { data: permission, status: notificationPermissionStatus } = useNotificationPermission();
  const { mutate: subscribeWebPushNotification, status: subscriptionStatus } = useSubscribeWebPushNotification();
  const { mutate: requestNotificationPermission } = useRequestNotificationPermission();

  const handleOkClick = useCallback(() => {
    requestNotificationPermission(undefined, {
      onSuccess: () => {
        subscribeWebPushNotification();
      },
    });
  }, [requestNotificationPermission, subscribeWebPushNotification]);

  const shouldDisplayAlert = () => {
    if (notificationPermissionStatus === "pending") {
      return false;
    }

    if (subscriptionStatus === "pending") {
      return true;
    }

    return permission === "default" || permission === "denied";
  };

  const shouldRenderChildren = () => {
    return permission === "granted" && subscriptionStatus !== "pending";
  };

  return (
    <>
      <OkAlert
        body={<AlertBody isSubscribing={subscriptionStatus === "pending"} permission={permission} />}
        header={t("Notifications permission")}
        isOpen={shouldDisplayAlert()}
        onClick={handleOkClick}
        onClose={handleOkClick}
      />
      {shouldRenderChildren() && props.children}
    </>
  );
}
