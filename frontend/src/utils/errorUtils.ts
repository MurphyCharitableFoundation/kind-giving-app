type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function parseBackendErrors<T extends Record<string, any>>(
  data: Record<string, any> | undefined,
  knownFields: (keyof T)[],
  fallbackMessage: string = "An unknown error occurred."
): { fieldErrors: FieldErrors<T>; nonFieldError: string | null } {
  const fieldErrors: FieldErrors<T> = {};
  let nonFieldError: string | null = null;

  if (data) {
    for (const key in data) {
      if (knownFields.includes(key as keyof T)) {
        fieldErrors[key as keyof T] = data[key];
      } else {
        nonFieldError = nonFieldError ? `${nonFieldError} ${data[key]}` : data[key];
      }
    }
  }
  if (!nonFieldError && !Object.keys(fieldErrors).length) {
    nonFieldError = fallbackMessage;
  }
  return { fieldErrors, nonFieldError };
}
