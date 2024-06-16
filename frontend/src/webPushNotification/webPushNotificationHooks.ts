import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "share";

import {
  getNotificationPermission,
  getWebPushNotificationSubscription,
  requestNotificationPermission,
  subscribeWebPushNotification,
} from "./webPushNotificationBrowserApis";

export function useNotificationPermission() {
  return useQuery({
    queryFn: () => getNotificationPermission(),
    queryKey: ["notificationPermission"],
    staleTime: Infinity,
  });
}

export function useRequestNotificationPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestNotificationPermission,
    onSuccess: (permission) => {
      queryClient.setQueryData(["notificationPermission"], permission);
    },
  });
}

export function useSubscribeWebPushNotification() {
  return useMutation({
    mutationFn: async () => {
      const currentSubscription = await getWebPushNotificationSubscription();

      if (currentSubscription !== null) {
        return;
      }

      const webPushSubscription = await subscribeWebPushNotification();

      return request({
        body: { webPushSubscription },
        method: "POST",
        url: "/api/web-push-subscriptions",
      });
    },
  });
}
