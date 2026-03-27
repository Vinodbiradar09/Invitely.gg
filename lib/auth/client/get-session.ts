import { headers } from "next/headers";
import { auth } from "../server/auth";
import { cache } from "react";

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});
