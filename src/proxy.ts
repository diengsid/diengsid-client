import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function proxy(req: NextRequest) {
  // forward seluruh Cookie header agar backend bisa baca HTTP-only cookie "token"
  const cookieHeader = req.headers.get("cookie") ?? "";

  if (!cookieHeader.includes("token=")) {
    return redirectHome(req);
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/_current`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    if (!res.ok) {
      return redirectHome(req);
    }

    const body = await res.json();
    const role: string = body?.data?.role ?? "";

    if (role.toUpperCase() !== "ADMIN") {
      return redirectForbidden(req);
    }

    return NextResponse.next();
  } catch {
    return redirectHome(req);
  }
}

function redirectHome(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url);
}

function redirectForbidden(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.search = "?forbidden=1";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    // "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)$).*)",
  ],
};
