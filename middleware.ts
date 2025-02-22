// export { auth as middleware } from "@/auth";

import { auth } from "@/auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
const authRoutes = [
  "/auth",
  "/auth/send-verification-token",
  "/register",
  "/sign-out",
  "/auth/verify-email",
];
export default auth((req) => {
  if (!req.auth && !authRoutes.includes(req.nextUrl.pathname)) {
    const newUrl = new URL("/auth", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});
