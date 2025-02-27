// export { auth as middleware } from "@/auth";

import { auth } from "@/auth";
import { logger } from "./lib/logger";
const log = logger.child({ module: "middleware" });

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
const authRoutes = [
  "/auth",
  "/auth/send-verification-token",
  "/auth/forget-password",
  "/register",
  "/sign-out",
  "/auth/verify-email",
];
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  if (isLoggedIn) {
    log.info("User is logged in");
    return;
  }
  if (!isLoggedIn && !authRoutes.includes(req.nextUrl.pathname)) {
    log.warn("User is not logged in, redirecting to /auth");
    const newUrl = new URL("/auth", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});
