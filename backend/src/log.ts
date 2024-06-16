import { errorSerializer } from "share";

export function log(value: unknown) {
  console.log(JSON.stringify(value, errorSerializer, 2));
}

export function logWarning(value: unknown) {
  console.warn(JSON.stringify(value, errorSerializer, 2));
}

export function logError(value: unknown) {
  console.error(JSON.stringify(value, errorSerializer, 2));
}
