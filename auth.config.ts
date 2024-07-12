import type { NextAuthConfig } from "next-auth";
export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashBoard = nextUrl.pathname.startsWith("/dashboard");
            const isOnLogin = nextUrl.pathname.startsWith("/login");
            if (isOnDashBoard) {
                if (isLoggedIn) {
                    return true;
                }
                return false;
            } else if (isLoggedIn && isOnLogin) {
                return Response.redirect(new URL("/dashboard", nextUrl))
            }
            return true;
        }
    },
    providers: []
} satisfies NextAuthConfig;