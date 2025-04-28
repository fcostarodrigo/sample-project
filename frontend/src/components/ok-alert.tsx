import { Button, Dialog, type DialogOpenChangeDetails } from "@chakra-ui/react";
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface OkAlertProps {
  readonly body: ReactNode;
  readonly header: string;
  readonly isOpen: boolean;
  readonly onClick: () => void;
  readonly onClose: () => void;
}

export function OkAlert(props: OkAlertProps) {
  const { t } = useTranslation();

  const handleOpenChange = (details: DialogOpenChangeDetails) => {
    if (!details.open) {
      props.onClose();
    }
  };

  return (
    <Dialog.Root
      motionPreset="slide-in-bottom"
      onOpenChange={handleOpenChange}
      open={props.isOpen}
      placement="center"
      role="alertdialog"
    >
      <Dialog.Trigger />
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>{props.header}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>{props.body}</Dialog.Body>
          <Dialog.Footer>
            <Button colorScheme="green" onClick={props.onClick}>
              {t("OK")}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
