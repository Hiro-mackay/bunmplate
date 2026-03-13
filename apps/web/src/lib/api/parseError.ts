interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    details?: Array<{ path: string; message: string }>;
  };
}

function isErrorEnvelope(value: unknown): value is ErrorEnvelope {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as ErrorEnvelope).error?.message === "string"
  );
}

export function parseError(error: unknown): string {
  if (isErrorEnvelope(error)) {
    const { details, message } = error.error;
    if (details?.length) {
      return details.map((d) => `${d.path}: ${d.message}`).join(", ");
    }
    return message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
}
