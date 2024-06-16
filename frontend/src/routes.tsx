import { RouteObject } from "react-router-dom";

import { RouterErrorElement } from "./components/DefaultError";
import { Root } from "./root";

export const routes: RouteObject[] = [
  {
    element: <Root />,
    errorElement: <RouterErrorElement />,
    path: "/",
  },
];
