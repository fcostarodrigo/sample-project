import { useMutation } from "@tanstack/react-query";
import { request } from "share";

export function useSendMessage() {
  return useMutation({
    mutationFn: (message: string) =>
      request({
        body: { message },
        method: "POST",
        url: "/api/messages",
      }),
  });
}
