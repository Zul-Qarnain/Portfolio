
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Imported usePathname
import { useState, useEffect, useRef } from "react"; // Imported useRef
import { Menu, X, Code2, ChevronDown } from "lucide-react"; // Added ChevronDown
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Imported DropdownMenu components

const navItems = [
  { href: "/", label: "Home" },
  { href: "/publications", label: "Publications" },
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Events" },
  { href: "/posts", label: "Posts" },
  { href: "/contact", label: "Contact Me" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pathname = usePathname(); // Get the current pathname
  // Added this to measure the width of the active link for the underline effect

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out flex justify-center md:px-8", // Centered the header content and added horizontal padding for desktop
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-md" : "bg-transparent"
      )}
    >
      <div className="section-container">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile View: Menu Dropdown and Theme Toggle */}
          <div className="flex w-full items-center justify-between md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="font-headline text-foreground">
                  Menu
                  <ChevronDown className="ml-1.5 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} aria-label={`Navigate to ${item.label}`}>
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </div>

          {/* Desktop View: Logo */}
          <Link href="/" className="hidden md:flex items-center gap-2 flex-shrink-0 mr-4" aria-label="Persona Homepage">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-headline text-foreground">
              Persona
            </span>
          </Link>

          {/* Desktop View: Combined Nav and Theme Toggle Container */}
          <div className="hidden md:flex items-center bg-indigo-500/30 backdrop-blur-lg rounded-full px-6 py-2 space-x-8 mx-auto"> {/* Changed background to violet, added transparency, used mx-auto to center, adjusted padding and space */}
            <nav className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href} // Removed extra argument in cn
                  className={cn( // Wrapped className in cn
                    "text-foreground text-opacity-80 hover:text-opacity-100 transition-colors font-medium text-base", // Increased text size slightly
                    pathname === item.href && "text-primary text-opacity-100" // Highlight active link
                  )}
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop View: Theme Toggle (outside the nav capsule) */}
          <div className="hidden md:flex items-center bg-indigo-500/30 backdrop-blur-lg rounded-full p-2 ml-4"> {/* Styled as a separate rounded element with margin-left for spacing */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
