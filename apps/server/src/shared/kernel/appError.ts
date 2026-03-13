export type ErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly details?: unknown;

  private constructor(code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = details;
  }

  static validation(message: string, details?: unknown): AppError {
    return new AppError("VALIDATION_ERROR", message, details);
  }

  static notFound(message: string): AppError {
    return new AppError("NOT_FOUND", message);
  }

  static conflict(message: string): AppError {
    return new AppError("CONFLICT", message);
  }

  static unauthorized(message: string): AppError {
    return new AppError("UNAUTHORIZED", message);
  }

  static forbidden(message: string): AppError {
    return new AppError("FORBIDDEN", message);
  }

  static internal(message: string): AppError {
    return new AppError("INTERNAL_ERROR", message);
  }

  get statusCode(): number {
    const map: Record<ErrorCode, number> = {
      VALIDATION_ERROR: 400,
      NOT_FOUND: 404,
      CONFLICT: 409,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      INTERNAL_ERROR: 500,
    };
    return map[this.code];
  }
}
