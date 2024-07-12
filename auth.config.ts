import type { NextAuthConfig } from "next-auth";
export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            console.log(nextUrl.toString());

            const isLoggedIn = !!auth?.user;
            const isOnDashBoard = nextUrl.pathname.startsWith("/dashboard");
            const isOnLogin = nextUrl.pathname.startsWith("/login");
            if (isOnDashBoard) {
                if (isLoggedIn) {
                    return true;
                }
                return false;
            } else if (isLoggedIn) {
                const callbackUrl = nextUrl.searchParams.get("callbackUrl");
                if (callbackUrl) {
                    return Response.redirect(new URL(callbackUrl, nextUrl))
                } else {
                    return Response.redirect(new URL("/dashboard", nextUrl))
                }
            }
            return true;
        }
    },
    providers: []
} satisfies NextAuthConfig;