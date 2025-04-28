import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactElement } from "react";

export function setup(ui: ReactElement) {
  const user = userEvent.setup();

  const element = render(ui);

  return { element, user };
}
