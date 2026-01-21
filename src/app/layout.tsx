"use client";

import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import { AuthProvider, useAuth } from "@/contexts/auth.context";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { usePathname } from "next/navigation";

function LayoutContent({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Check if we're on an auth page
  const isAuthPage = pathname?.startsWith("/auth/");

  // Don't show layout on auth pages
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Show dashboard layout only when authenticated
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        <Header />
        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
          {/* User Info Banner */}
          {user && (
            <div className="mb-6 rounded-lg bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                    <span className="text-xl font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark dark:text-white">
                      {user.username}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Role: <span className="font-medium">{user.role}</span>
                    </p>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${user.role === "RH" ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" :
                      user.role === "Manager" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" :
                        user.role === "Directeur" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" :
                          "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AuthProvider>
            <NextTopLoader color="#5750F1" showSpinner={false} />
            <LayoutContent>{children}</LayoutContent>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
