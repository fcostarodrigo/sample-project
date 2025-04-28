// By default JSON.stringify(error) returns `'{}'` because the fields of Error are not enumerable.

export function errorSerializer(_key: string, value: unknown): unknown {
  if (value instanceof Error) {
    return {
      // We want to automatically include owned properties of classes that extend Error
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...value,
      cause: value.cause,
      message: value.message,
      name: value.name,
      stack: value.stack
        ?.split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    };
  }

  return value;
}
