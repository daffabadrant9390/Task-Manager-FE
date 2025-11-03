"use client";

import type React from "react";
import { DashboardLayout } from "./DashboardLayout";

export const RootLayoutClient = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}