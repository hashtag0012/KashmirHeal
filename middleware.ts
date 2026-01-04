import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isOnboarded = token?.isOnboarded;
        const isOnboardingPage = req.nextUrl.pathname.startsWith("/onboarding");
        const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

        if (isAuth) {
            // 1. Force un-onboarded users to /onboarding
            if (!isOnboarded && !isOnboardingPage) {
                return NextResponse.redirect(new URL("/onboarding", req.url));
            }
            // 2. Prevent active DOCTOR/ADMIN from going back to /onboarding
            if (isOnboardingPage && (token?.role === "DOCTOR" || token?.role === "ADMIN")) {
                return NextResponse.redirect(new URL("/", req.url));
            }
            // 3. Admin protection
            if (isAdminPage && token?.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const pn = req.nextUrl.pathname;
                // Allow public access to home and search
                if (pn === "/" || pn === "/search" || pn.startsWith("/api/")) {
                    return true;
                }
                // Require token for everything else
                return !!token;
            },
        },
        pages: {
            signIn: "/auth/signin"
        }
    }
);

export const config = {
    matcher: [
        "/",
        "/onboarding",
        "/doctor/:path*",
        "/patient/:path*",
        "/admin/:path*",
        "/search"
    ]
};
