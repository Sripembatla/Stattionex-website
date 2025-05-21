import { NextResponse } from "next/server";

export default function middleware(req) {
  const accessToken = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone(); // Clone safely

  const protectedRoutes = [
    "/profile",
    "/orders",
    "/refer",
    "/coupon",
    "/address",
    "/privacy",
    "/help",
    "/faq",
    "/order-summary",
  ];

  // Redirect to /?login=true if user is not authenticated
  if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    if (!accessToken) {
      url.pathname = "/";
      url.searchParams.set("login", "true");
      return NextResponse.redirect(url);
    }
  }

  // If already logged in, prevent access to /auth
  if (accessToken && url.pathname === "/auth") {
    url.pathname = "/";
    url.searchParams.delete("login");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth",  
    "/", // Home page
    "/profile",
    "/orders",
    "/refer",
    "/coupon",
    "/address",
    "/privacy",
    "/help",
    "/faq",
    "/products",
    "/search",
    "/order-summary",
  ], 
};