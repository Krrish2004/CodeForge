"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { AnimatedButton } from './animated-card';
import { Button } from './button';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className="w-10 h-10"></div>;
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <AnimatedButton>
      <Button
        onClick={toggleTheme}
        variant="outline"
        size="icon"
        className="rounded-full"
        aria-label="Toggle theme"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: theme === 'dark' ? 0 : 180 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="w-5 h-5 relative"
        >
          <motion.div
            animate={{ 
              opacity: theme === 'dark' ? 1 : 0,
              scale: theme === 'dark' ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <MoonIcon className="w-5 h-5" />
          </motion.div>
          
          <motion.div
            animate={{ 
              opacity: theme === 'light' ? 1 : 0,
              scale: theme === 'light' ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <SunIcon className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </Button>
    </AnimatedButton>
  );
} 