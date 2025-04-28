import { Dialog } from "@chakra-ui/react";

export function PersistentAlert(props: { body: string; header: string }) {
  return (
    <Dialog.Root open={true} placement="center" role="alertdialog">
      <Dialog.Trigger />
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>{props.header}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>{props.body}</Dialog.Body>
          <Dialog.Footer />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
