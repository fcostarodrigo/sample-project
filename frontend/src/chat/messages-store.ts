import { create } from "zustand";

import { addServiceWorkerMessageListener } from "../notifications/notification-browser-api";

interface MessagesStore {
  addMessage: (message: string) => void;
  messages: string[];
}

export const useMessagesStore = create<MessagesStore>()((set) => ({
  addMessage: (message: string) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },
  messages: [],
}));

addServiceWorkerMessageListener((event) => {
  useMessagesStore.getState().addMessage(event.data);
});
