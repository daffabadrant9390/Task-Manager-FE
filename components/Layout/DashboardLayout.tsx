"use client";

import { useState, useEffect, useRef } from "react";
import { Navigation } from "./Navigation";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/lib/hooks/useTheme";
import Image from "next/image";

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({
  children
}: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const {
    theme,
    toggleTheme
  } = useTheme();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[data-sidebar-toggle]')
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when sidebar is open on mobile
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSidebarOpen]);
  
  return (
    <div className="flex h-screen bg-[#1D2125] overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed md:relative left-0 top-0 h-screen bg-[#22272B] text-[#B6C2CF]
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:translate-x-0"}
          md:w-64 md:translate-x-0
          flex flex-col border-r border-[#38414A] z-40
          overflow-hidden
        `}
      >
        {/* Logo */}
        <div className="p-4 md:p-6 border-b border-[#38414A] shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="text-lg font-semibold text-[#B6C2CF] truncate">TaskMinder.</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <Navigation />
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-[#38414A] shrink-0">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#F87171] hover:bg-[#2C333A] transition-colors font-medium cursor-pointer">
            <span>↩</span>
            <span>Log out</span>
          </button>
        </div>

      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-[#22272B] border-b border-[#38414A] shrink-0">
          <div className="flex items-center justify-between p-3 md:p-4 lg:p-6 gap-2 md:gap-4">
            <button
              data-sidebar-toggle
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 hover:bg-[#2C333A] rounded-lg transition-colors shrink-0 cursor-pointer"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-[#B6C2CF]" />
              ) : (
                <Menu className="w-5 h-5 text-[#B6C2CF]" />
              )}
            </button>

            <div className="flex flex-row w-full justify-end items-center gap-2 md:gap-4 shrink-0">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-[#2C333A] rounded-lg transition-colors cursor-pointer"
                aria-label="Toggle dark mode"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5 text-[#B6C2CF]" />
                ) : (
                  <Sun className="w-5 h-5 text-[#B6C2CF]" />
                )}
              </button>
              <button className="w-8 h-8 md:w-10 md:h-10 bg-[#2C333A] rounded-full overflow-hidden shrink-0 border border-[#38414A] cursor-pointer hover:bg-[#38414A] transition-colors">
                <Image src="https://i.pravatar.cc/150?img=3" height={40} width={40} alt="User" className="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-3 md:p-4 lg:p-6 scrollbar-hide bg-[#1D2125]">{children}</main>
      </div>
    </div>
  )
} 