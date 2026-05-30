import { NextRequest, NextResponse } from "next/server";

// Proxy runs on Edge Runtime — only NEXT_PUBLIC_ vars are accessible.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function proxy(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") ?? "";

  if (!cookieHeader.includes("token=")) {
    return redirectHome(req);
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/_current`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    if (!res.ok) return redirectHome(req);

    const body = await res.json();
    const role: string = body?.data?.role ?? "";

    if (role.toUpperCase() !== "ADMIN") return redirectForbidden(req);

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
  matcher: ["/admin", "/admin/:path*"],
};
