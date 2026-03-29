import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/server/auth";

export const { GET, POST } = toNextJsHandler(auth);
