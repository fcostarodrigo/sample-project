import { useRouteError } from "react-router-dom";
import { errorSerializer } from "share";

export function RouterErrorElement() {
  const error = useRouteError();
  return <DefaultError error={error} />;
}

export function DefaultError(props: { error: unknown }) {
  return <pre>{JSON.stringify(props.error, errorSerializer, 2)}</pre>;
}
