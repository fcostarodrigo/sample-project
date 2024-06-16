import { Card, CardBody, CardFooter, Divider, Icon, IconButton, Input, Stack } from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsSend } from "react-icons/bs";

import { useMessagesStore } from "../webPushNotification/serviceWorkerMessageStore";
import { Message } from "./Message";
import { useSendMessage } from "./useSendMessage";

export function Chat() {
  const messages = useMessagesStore((state) => state.messages);
  const [message, setMessage] = useState("");
  const { t } = useTranslation();
  const { mutate: sendMessage } = useSendMessage();

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setMessage(event.target.value);
    },
    [setMessage],
  );

  const handleSendClick = useCallback(() => {
    sendMessage(message);
    setMessage("");
  }, [sendMessage, message]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      sendMessage(message);
      setMessage("");
    },
    [sendMessage, message],
  );

  return (
    <Card maxWidth={1000}>
      <CardBody>
        <Stack gap={3}>
          {messages.map((message) => (
            <Message key={message} message={message} />
          ))}
        </Stack>
      </CardBody>
      <Divider />
      <form onSubmit={handleSubmit}>
        <CardFooter gap={3}>
          <Input
            autoFocus
            colorScheme="green"
            flexGrow={1}
            onChange={handleInputChange}
            placeholder={t("Type your message here")}
            value={message}
          />
          <IconButton
            aria-label={t("Send")}
            colorScheme="green"
            icon={<Icon as={BsSend} boxSize={5} />}
            onClick={handleSendClick}
          />
        </CardFooter>
      </form>
    </Card>
  );
}
