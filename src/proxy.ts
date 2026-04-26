import { NextResponse, type NextRequest } from "next/server";
import { isBlockedProbePath, isScannerUserAgent } from "@/lib/security";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent");

  if (isBlockedProbePath(pathname)) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (isScannerUserAgent(userAgent)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
