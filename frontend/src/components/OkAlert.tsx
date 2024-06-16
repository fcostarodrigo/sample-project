import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import React, { MutableRefObject, ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface OkAlertProps {
  readonly body: ReactNode;
  readonly header: string;
  readonly isOpen: boolean;
  readonly onClick: () => void;
  readonly onClose: () => void;
}

export function OkAlert(props: OkAlertProps) {
  const buttonRef = React.useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>;
  const { t } = useTranslation();

  return (
    <AlertDialog
      isCentered
      isOpen={props.isOpen}
      leastDestructiveRef={buttonRef}
      motionPreset="slideInBottom"
      onClose={props.onClose}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          {props.header}
        </AlertDialogHeader>
        <AlertDialogBody>{props.body}</AlertDialogBody>
        <AlertDialogFooter>
          <Button colorScheme="green" onClick={props.onClick} ref={buttonRef}>
            {t("OK")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
