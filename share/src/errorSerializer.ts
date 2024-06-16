export function errorSerializer(key: string, value: unknown) {
  if (value instanceof Error) {
    return {
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
