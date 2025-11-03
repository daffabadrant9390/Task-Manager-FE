"use client";

import { SELECTED_THEME_LOCAL_STORAGE_KEY } from "@/lib/constant";
import { createContext, useEffect, useRef, useState } from "react";

export type ThemeOptions = 'light' | 'dark';

export interface ThemeContextType {
  theme: ThemeOptions;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeOptions>("light")
  const didInit = useRef(false)

  useEffect(() => {
    const selectedThemeLS = localStorage?.getItem(SELECTED_THEME_LOCAL_STORAGE_KEY)
    if (!!selectedThemeLS) {
      queueMicrotask(() => setSelectedTheme(selectedThemeLS as ThemeOptions))
    }
  }, [])

  useEffect(() => {
    if (!didInit.current) {
      // Skip persisting on the very first run to avoid overwriting existing preference
      didInit.current = true
    }

    const htmlDocumentElement = document.documentElement
    if (selectedTheme === "dark") {
      htmlDocumentElement?.classList?.add("dark")
    } else {
      htmlDocumentElement?.classList?.remove("dark")
    }
    localStorage.setItem(SELECTED_THEME_LOCAL_STORAGE_KEY, selectedTheme)
  }, [selectedTheme])

  const toggleTheme = () => {
    setSelectedTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{ theme: selectedTheme, toggleTheme }}>
      <div suppressHydrationWarning>{children}</div>
    </ThemeContext.Provider>
  )
}