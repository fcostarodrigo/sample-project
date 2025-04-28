import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscribeApi, subscriptionParamsSchema } from "share";

import {
  getNotificationPermission,
  getSubscriptionParams,
  requestNotificationPermission,
  subscribePushNotification,
} from "./notification-browser-api";

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

export function useSubscribeNotification() {
  return useMutation({
    mutationFn: async () => {
      const currentSubscription = await getSubscriptionParams();

      if (currentSubscription !== null) {
        return;
      }

      const pushNotification = await subscribePushNotification();
      const subscriptionParams = subscriptionParamsSchema.parse(pushNotification.toJSON());

      return subscribeApi.sendRequest({ subscriptionParams });
    },
  });
}
