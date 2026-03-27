import { UnauthorizedError } from "@/lib/shared/exceptions";
import { headers } from "next/headers";
import { auth } from "../server/auth";

export const requireSession = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) {
    throw new UnauthorizedError();
  }
  return session;
};
