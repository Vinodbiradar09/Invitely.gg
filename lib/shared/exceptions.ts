import { InvitelyApiError } from "./base";
import { z } from "zod";

export class UnauthorizedError extends InvitelyApiError {
  constructor(message = "Unauthorized. Please sign in to continue.") {
    super(401, message, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends InvitelyApiError {
  constructor(message = "Forbidden. Access denied.") {
    super(403, message, "FORBIDDEN");
  }
}

export class NotFoundError extends InvitelyApiError {
  constructor(message = "Resource not found.") {
    super(404, message, "NOT_FOUND");
  }
}

export class ValidationError extends InvitelyApiError {
  public readonly errors?: z.ZodIssue[];
  constructor(message = "Invalid request data.", errors?: z.ZodIssue[]) {
    super(422, message, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export class ConflictError extends InvitelyApiError {
  constructor(message = "Conflict. Resource already exists.") {
    super(409, message, "CONFLICT");
  }
}

export class InternalServerError extends InvitelyApiError {
  constructor(message = "Internal server error.") {
    super(500, message, "INTERNAL_SERVER_ERROR");
  }
}
