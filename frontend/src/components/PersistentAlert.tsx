import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import React, { MutableRefObject } from "react";

function handleClose() {
  console.warn("Unexpected close modal");
}

export function PersistentAlert(props: { body: string; header: string }) {
  const bodyRef = React.useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;

  return (
    <AlertDialog isCentered isOpen leastDestructiveRef={bodyRef} motionPreset="slideInBottom" onClose={handleClose}>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          {props.header}
        </AlertDialogHeader>
        <AlertDialogBody ref={bodyRef}>{props.body}</AlertDialogBody>
        <AlertDialogFooter />
      </AlertDialogContent>
    </AlertDialog>
  );
}
