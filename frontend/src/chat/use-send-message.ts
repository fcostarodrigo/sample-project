import { useMutation } from "@tanstack/react-query";
import { sendMessageApi } from "share";

export function useSendMessage() {
  return useMutation({
    mutationFn: sendMessageApi.sendRequest,
  });
}
