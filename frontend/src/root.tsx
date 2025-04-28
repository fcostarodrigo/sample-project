import { Center } from "@chakra-ui/react";

import { Chat } from "./chat/chat";
import { NotificationSetup } from "./notifications/notification-setup";

export const Root = () => {
  return (
    <Center backgroundImage="linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)" minHeight="100dvh">
      <NotificationSetup>
        <Chat />
      </NotificationSetup>
    </Center>
  );
};
