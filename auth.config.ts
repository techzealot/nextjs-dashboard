import type { NextAuthConfig } from "next-auth";
import { NextResponse } from 'next/server';

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            console.log(nextUrl.toString());

            const isLoggedIn = !!auth?.user;
            const isOnDashBoard = nextUrl.pathname.startsWith("/dashboard");
            if (isOnDashBoard) {
                if (isLoggedIn) {
                    return true;
                }
                return false;
            }
            return true;
        }
    },
    providers: []
} satisfies NextAuthConfig;