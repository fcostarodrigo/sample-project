import { Avatar, Card, HStack, Text } from "@chakra-ui/react";

export function Message(props: { message: string }) {
  return (
    <HStack>
      <Avatar.Root backgroundColor="green.400" />
      <Card.Root boxShadow="none">
        <Card.Body>
          <Text>{props.message}</Text>
        </Card.Body>
      </Card.Root>
    </HStack>
  );
}
