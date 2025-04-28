import { type RouteObject } from "react-router-dom";

import { RouterErrorElement } from "./components/default-error";
import { Root } from "./root";

export const routes: RouteObject[] = [
  {
    element: <Root />,
    errorElement: <RouterErrorElement />,
    path: "/",
  },
];
