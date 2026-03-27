import { ValidationError } from "../shared/exceptions";
import { z } from "zod";

const validateRequest = <T>(schema: z.ZodSchema<T>, body: unknown): T => {
  const data = schema.safeParse(body);
  if (!data.success) {
    const error = data.error.issues
      .map((issue) => {
        // if there's a path, join it. If not top-level error just show message.
        const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
        return `${path}${issue.message}`;
      })
      .join("; ");

    throw new ValidationError(error, data.error.issues);
  }
  return data.data;
};

export { validateRequest };
