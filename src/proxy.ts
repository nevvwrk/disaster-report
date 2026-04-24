import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  console.log("proxy pathname", pathname)
  console.log("proxy token :", token);

  const isDashboard = /^\/(th|en)\/dashboard(\/.*)?$/.test(pathname);
  const isLogin = /^\/(th|en)\/login$/.test(pathname);

  if (isLogin) {
    return NextResponse.next();
  }

  if (isDashboard && !token) {
    const locale = pathname.split("/")[1] || "th";
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(th|en)/:path*"],
}