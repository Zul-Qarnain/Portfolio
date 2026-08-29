
"use client";

import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        className="text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <Sun className="h-5 w-5 opacity-75" /> 
      </Button>
    );
  }

  const getLabel = () => {
    if (theme === "dark") return "Dark Mode (Click for Anime Mode)";
    if (theme === "anime-retro") return "Anime Mode (Click for Light Mode)";
    return "Light Mode (Click for Dark Mode)";
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={getLabel()}
      aria-label={getLabel()}
      className={`text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 ${
        theme === "anime-retro" 
          ? "border border-purple-500/50 bg-purple-500/15 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.5)]" 
          : ""
      }`}
    >
      {theme === "dark" && <Moon className="h-5 w-5" />}
      {theme === "anime-retro" && <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />}
      {theme === "light" && <Sun className="h-5 w-5" />}
    </Button>
  );
}
