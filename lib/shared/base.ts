export abstract class InvitelyApiError extends Error {
  public readonly statusCode: number;
  public readonly success = false;
  public readonly code?: string;

  protected constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export function isInvitelyApiError(error: unknown): error is InvitelyApiError {
  return error instanceof InvitelyApiError;
}
