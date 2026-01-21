import "@/css/satoshi.css";
import "@/css/style.css";

import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/auth.context";
import { Providers } from "../providers";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
    title: {
        template: "%s | HR Management",
        default: "HR Management - Sign In",
    },
    description: "HR Management System - Authentication",
};

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </Providers>
            </body>
        </html>
    );
}
