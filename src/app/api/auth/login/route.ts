import authApiRequest from "@/apiRequests/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { HttpError } from "@/lib/http";
import { LoginBodyType } from "@/schemaValidations/auth.schema";

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType;
  const cookieStore = cookies();
  try {
    const { payload } = await authApiRequest.sLogin(body);
    const { accessToken, refreshToken } = payload.data;
    const decodedAccessToken = jwt.decode(accessToken) as { exp: number };
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number };
    cookieStore.set("accessToken", accessToken, {
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", refreshToken, {
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });
    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status });
    } else {
      return Response.json({
        message: "Đã có lỗi xảy ra",
        status: 500,
      });
    }
  }
}
