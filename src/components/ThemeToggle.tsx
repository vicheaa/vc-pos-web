"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <div
        className="flex items-center rounded-full border p-1"
        onClick={(e) => e.stopPropagation()}
    >
        <button
            onClick={() => setTheme("light")}
            aria-label="Switch to light mode"
            className={`rounded-full p-1 transition-colors ${
                theme === "light" || (theme === "system" && !window.matchMedia('(prefers-color-scheme: dark)').matches)
                 ? "bg-primary text-primary-foreground"
                 : "hover:bg-accent"
            }`}
        >
            <Sun className="h-4 w-4" />
        </button>
        <button
            onClick={() => setTheme("dark")}
            aria-label="Switch to dark mode"
            className={`rounded-full p-1 transition-colors ${
                theme === "dark" || (theme === "system" && window.matchMedia('(prefers-color-scheme: dark)').matches)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
            }`}
        >
            <Moon className="h-4 w-4" />
        </button>
    </div>
  )
}
