import { ThemeContext } from "@/components/ThemeProvider"
import { useContext } from "react"

export const useTheme = () => {
  const themeContext = useContext(ThemeContext);

  if (themeContext === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  };
  return themeContext;
}