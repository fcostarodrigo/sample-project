import { theme as chakraTheme, extendBaseTheme } from "@chakra-ui/react";

const { Alert, Avatar, Button, Card, CloseButton, Divider, Input, Modal } = chakraTheme.components;

const colors = {
  brand: {
    700: "#2a69ac",
    800: "#153e75",
    900: "#1a365d",
  },
};

export const theme = extendBaseTheme({
  colors,
  components: {
    Alert,
    Avatar,
    Button,
    Card,
    CloseButton,
    Divider,
    Input,
    Modal,
  },
});
