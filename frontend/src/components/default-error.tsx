import { useRouteError } from "react-router-dom";
import { errorSerializer } from "share";

export function DefaultError(properties: { error: unknown }) {
  return <pre>{JSON.stringify(properties.error, errorSerializer, 2)}</pre>;
}

export function RouterErrorElement() {
  const error = useRouteError();
  return <DefaultError error={error} />;
}
