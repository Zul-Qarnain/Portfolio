
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Imported usePathname
import { Menu, Code2 } from "lucide-react"; // Added ChevronDown
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
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/#publications", label: "Publications" },
  { href: "/#events", label: "Events" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "fixed top-6 left-0 right-0 z-50 flex justify-center px-4",
        "transition-all duration-300 ease-in-out"
      )}
    >
      <div className={cn(
        "flex items-center justify-between w-full max-w-5xl px-6 py-3 rounded-full",
        "bg-[#1e1e2e]/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
      )}>
        {/* Mobile View: Menu Dropdown and Theme Toggle */}
        <div className="flex w-full items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
             <Code2 className="h-6 w-6 text-foreground" />
             <span className="text-lg font-bold font-headline text-foreground">Zul-Qarnain</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#1e1e2e]/90 backdrop-blur-xl border-white/10 text-white">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="focus:bg-white/10 focus:text-white">
                    <Link href={item.href} className="w-full cursor-pointer">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
