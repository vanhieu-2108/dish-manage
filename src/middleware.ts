import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // pathname: manage/dashboard
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  // Chưa đăng nhập thì không cho vào privatePaths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
  // Đã đăng nhập thì không cho vào unAuthPaths
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
  // Trường hợp đăng nhập rồi nhưng accessToken hết hạn
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !accessToken &&
    refreshToken
  ) {
    const url = new URL("/logout", request.nextUrl);
    url.searchParams.set("refreshToken", refreshToken);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*", "/login"],
};
