
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Code2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
const navItems = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/#publications", label: "Publications" },
  { href: "/#events", label: "Events" },
  { href: "/posts", label: "Posts" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide navbar on admin pages
  if (pathname?.startsWith('/adminpacha')) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed bottom-4 md:bottom-auto md:top-6 left-0 right-0 z-50 flex justify-center px-4",
        "transition-all duration-300 ease-in-out"
      )}
    >
      {/* Mobile Menu Popup */}
      {isMenuOpen && (
        <div className="absolute bottom-full mb-4 left-4 right-4 md:hidden">
          <div className="bg-popover/95 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-200">
            <div className="flex flex-wrap justify-center gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    "hover:bg-secondary hover:text-primary",
                    pathname === item.href ? "text-primary bg-secondary font-bold" : "text-foreground bg-secondary/30"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={cn(
        "flex items-center justify-between w-full max-w-5xl px-6 py-3 rounded-full",
        "bg-background/70 backdrop-blur-xl border border-border shadow-lg"
      )}>
        {/* Mobile View: Menu Dropdown and Theme Toggle */}
        <div className="flex w-full items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
             <Code2 className="h-6 w-6 text-foreground" />
             <span className="text-lg font-bold font-headline text-foreground">Zul-Qarnain</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
            <Code2 className="h-6 w-6 text-foreground" />
            <span className="text-lg font-bold font-headline text-foreground">
              Zul-Qarnain
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
