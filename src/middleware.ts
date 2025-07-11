import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublic =
    path === "/signup" ||
    path === "/login" ||
    path === "/verifyEmail";

  const token = request.cookies.get("token")?.value||"";

  if (isPublic && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if(!isPublic && !token){
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/signup", "/login", "/verifyEmail", "/profile"],
};
