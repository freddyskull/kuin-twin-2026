"use strict";
"use client";

import React, { useState, useEffect } from "react";

export default function TestThemePage() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Check initial theme
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-300">
      <div className="p-8 border border-border rounded-lg bg-card text-card-foreground shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-primary">Theme Test</h1>
        <p className="mb-6 text-muted-foreground">
          Current Theme: <span className="font-mono font-bold">{theme}</span>
        </p>

        <div className="grid gap-4 mb-6">
          <div className="p-4 bg-primary text-primary-foreground rounded">
            Primary Color
          </div>
          <div className="p-4 bg-secondary text-secondary-foreground rounded">
            Secondary Color
          </div>
          <div className="p-4 bg-destructive text-destructive-foreground rounded">
            Destructive Color
          </div>
          <div className="p-4 bg-accent text-accent-foreground rounded">
            Accent Color
          </div>
          <div className="p-4 bg-muted text-muted-foreground rounded">
            Muted Color
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
        >
          Toggle Theme
        </button>
      </div>
    </div>
  );
}
