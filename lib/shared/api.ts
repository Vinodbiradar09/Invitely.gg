import { isInvitelyApiError } from "./base";
import { InternalServerError } from "./exceptions";
import { NextResponse } from "next/server";

// type ApiSuccessResponse<T> = {
//   success: true;
//   message: string;
//   data: T | null;
// };

type ApiErrorResponse = {
  success: false;
  message: string;
  code?: string;
};

export function InvitelyResponse<T>(
  status: number,
  message: string,
  data: T | null = null,
) {
  return NextResponse.json(
    {
      success: status >= 200 && status < 300,
      message,
      data,
    },
    { status },
  );
}

export function InvitelyError(error: unknown) {
  console.error("[Invitely_Api_Error]", error);

  if (isInvitelyApiError(error)) {
    const body: ApiErrorResponse = {
      success: false,
      message: error.message,
      code: error.code,
    };

    return NextResponse.json(body, {
      status: error.statusCode,
    });
  }

  const fallback = new InternalServerError();

  return NextResponse.json(
    {
      success: false,
      message: fallback.message,
      code: fallback.code,
    },
    { status: fallback.statusCode },
  );
}
