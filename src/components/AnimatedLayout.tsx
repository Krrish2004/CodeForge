"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ui/theme-toggle";

interface AnimatedLayoutProps {
  children: ReactNode;
}

export function AnimatedLayout({ children }: AnimatedLayoutProps) {
  const pathname = usePathname();
  
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/90">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
        <motion.div 
          className="container flex h-16 items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" className="flex items-center gap-2">
            <motion.span 
              className="font-bold text-2xl animated-gradient-text"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              CodeForge
            </motion.span>
          </Link>
          <nav className="flex items-center gap-6">
            <NavLink href="/dashboard" pathname={pathname}>
              Dashboard
            </NavLink>
            <NavLink href="/problems" pathname={pathname}>
              Problems
            </NavLink>
            <NavLink href="/contests" pathname={pathname}>
              Contests
            </NavLink>
            <NavLink href="/compare" pathname={pathname}>
              Compare
            </NavLink>
            <NavLink href="/submissions" pathname={pathname}>
              Submissions
            </NavLink>
            <ThemeToggle />
          </nav>
        </motion.div>
      </header>
      
      <AnimatePresence mode="wait">
        <motion.main 
          key={pathname}
          className="flex-1 container py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20, 
            duration: 0.3 
          }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      <footer className="border-t border-border/40 bg-background/80 backdrop-blur">
        <div className="container py-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CodeForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, pathname, children }: { href: string; pathname: string; children: ReactNode }) {
  const isActive = pathname.startsWith(href);
  
  return (
    <Link href={href} className="relative">
      <motion.span 
        className={`text-sm font-medium transition-colors ${isActive ? "text-primary" : "hover:text-primary"}`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {children}
      </motion.span>
      {isActive && (
        <motion.div 
          className="absolute -bottom-[21px] left-0 right-0 h-[3px] bg-primary"
          layoutId="navbar-indicator"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </Link>
  );
} 