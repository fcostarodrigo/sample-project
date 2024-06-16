import { Center } from "@chakra-ui/react";

import { Chat } from "./chat/Chat";
import { WebPushNotificationSetup } from "./webPushNotification/WebPushNotificationSetup";

export function Root() {
  return (
    <Center backgroundImage="linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)" minHeight="100dvh">
      <WebPushNotificationSetup>
        <Chat />
      </WebPushNotificationSetup>
    </Center>
  );
}
