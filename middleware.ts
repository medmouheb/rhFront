import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ["/auth/sign-in", "/auth/forgot-password", "/auth/sign-up"];
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    // Skip authentication check for public routes
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // Check if user is authenticated by calling the backend API
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
        const response = await fetch(`${apiUrl}/auth/me`, {
            headers: {
                // Forward all cookies from the incoming request
                cookie: request.headers.get("cookie") || "",
            },
            credentials: "include",
        });

        // If the API returns 401 (Unauthorized), user is not authenticated
        if (response.status === 401) {
            const signInUrl = new URL("/auth/sign-in", request.url);
            // Store the original URL to redirect back after login (optional)
            if (pathname !== "/") {
                signInUrl.searchParams.set("from", pathname);
            }
            return NextResponse.redirect(signInUrl);
        }

        // If API call succeeds, user is authenticated
        if (response.ok) {
            return NextResponse.next();
        }

        // For any other error, redirect to sign-in to be safe
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    } catch (error) {
        // If the API is unreachable or there's a network error, redirect to sign-in
        console.error("Middleware auth check error:", error);
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
}

// Configure which routes should be processed by this middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)",
    ],
};
