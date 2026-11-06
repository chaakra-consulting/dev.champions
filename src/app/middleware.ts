import { NextResponse, type NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

type Session = {
  user: {
    role: "admin" | "parent" | "student" | "mentor";
  };
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const pathSegments = path.split('/').filter(Boolean);
  const requestedPrefix = pathSegments[0]; 

  const validRoles = ["admin", "parent", "student", "mentor"];

  // Skip middleware if the path doesn't start with a valid role prefix
  if (!validRoles.includes(requestedPrefix)) {
    return NextResponse.next();
  }

  // Fetch the active session
  const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  // 1. UNAUTHENTICATED: Redirect to the specific role's login page
  if (!session) {
    if (!path.endsWith("/login")) {
      return NextResponse.redirect(new URL(`/${requestedPrefix}/login`, request.url));
    }
    return NextResponse.next(); // Allow them to view the login page
  }

  const userRole = session.user.role;

  // 2. WRONG ROLE: Redirect authenticated users trying to access another role's section
  if (userRole !== requestedPrefix) {
    return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url));
  }

  // 3. BYPASS LOGIN: Redirect authenticated users away from their own login page
  if (path === `/${userRole}/login`) {
    return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url));
  }

  // Proceed normally if authenticated and on the correct path
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/parent/:path*",
    "/student/:path*",
    "/mentor/:path*"
  ],
};