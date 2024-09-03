import type { NextAuthConfig } from "next-auth";
import { NextResponse } from 'next/server';

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnLoginPage = nextUrl.pathname === "/login";

            // 如果在需要登录的页面但未登录,拒绝访问
            if (isOnDashboard && !isLoggedIn) {
                return false;
            }

            // 如果已登录但试图访问登录页面,重定向到仪表板
            if (isLoggedIn && isOnLoginPage) {
                return NextResponse.redirect(new URL("/dashboard", nextUrl));
            }

            // 所有其他情况允许访问
            return true;
        }
    },
    providers: []
} satisfies NextAuthConfig;