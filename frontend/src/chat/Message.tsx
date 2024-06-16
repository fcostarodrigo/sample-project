import { Avatar, Card, CardBody, HStack, Text } from "@chakra-ui/react";

export function Message(props: { message: string }) {
  return (
    <HStack>
      <Avatar backgroundColor="green.400" />
      <Card boxShadow="none" variant="filled">
        <CardBody>
          <Text>{props.message}</Text>
        </CardBody>
      </Card>
    </HStack>
  );
}
