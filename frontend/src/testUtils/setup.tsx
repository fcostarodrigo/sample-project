import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";

export function setup(ui: ReactElement) {
  const user = userEvent.setup();

  render(ui);

  return { user };
}
