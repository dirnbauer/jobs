import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isStaticAsset(pathname: string): boolean {
  if (pathname.startsWith("/_next")) return true;
  const last = pathname.split("/").pop() ?? "";
  return last.includes(".");
}

function localeFromPath(pathname: string): "en" | "de" | null {
  const seg = pathname.split("/").filter(Boolean)[0];
  if (seg === "en" || seg === "de") return seg;
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api") || isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  const detected = localeFromPath(pathname);
  const requestHeaders = new Headers(request.headers);

  if (detected) {
    requestHeaders.set("x-locale", detected);
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
