import { Box, Card, IconButton, Input, Stack } from "@chakra-ui/react";
import { type ChangeEvent, type FormEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsSend } from "react-icons/bs";

import { Message } from "./message";
import { useMessagesStore } from "./messages-store";
import { useSendMessage } from "./use-send-message";

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
    sendMessage({ message });
    setMessage("");
  }, [sendMessage, message]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      sendMessage({ message });
      setMessage("");
    },
    [sendMessage, message],
  );

  return (
    <Card.Root maxWidth={1000}>
      <Card.Body>
        <Stack gap={3}>
          {messages.map((message) => (
            <Message key={message} message={message} />
          ))}
        </Stack>
      </Card.Body>
      <Box divideX="2px" />
      <form onSubmit={handleSubmit}>
        <Card.Footer gap={3}>
          <Input
            autoFocus
            colorScheme="green"
            flexGrow={1}
            onChange={handleInputChange}
            placeholder={t("Type your message here")}
            value={message}
          />
          <IconButton aria-label={t("Send")} onClick={handleSendClick} variant="outline">
            <BsSend />
          </IconButton>
        </Card.Footer>
      </form>
    </Card.Root>
  );
}
