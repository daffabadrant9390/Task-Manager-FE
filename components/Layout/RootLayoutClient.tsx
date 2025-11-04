"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { DashboardLayout } from "./DashboardLayout";
import { useAuth } from "@/lib/context/AuthContext";

export const RootLayoutClient = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login";

  
  // For everything else, only render the shell if authenticated
  const { isAuthenticated, loading } = useAuth();
  
  // Render auth routes without dashboard shell
  if (isAuthRoute) {
    return <>{children}</>;
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Use client redirects in your pages or let ProtectedRoute/page logic redirect
    // Here, we render nothing to avoid flashing the shell
    return null;
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};