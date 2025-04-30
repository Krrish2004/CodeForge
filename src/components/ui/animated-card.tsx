"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedCard({ children, className, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay, 
        type: "spring",
        stiffness: 100, 
        damping: 20
      }}
      className="w-full"
    >
      <Card className={className}>
        <CardContent className="p-4 sm:p-6">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  className = "" 
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({ 
  children, 
  delay = 0, 
  duration = 0.5,
  direction = "left", 
  className = "" 
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "left" | "right" | "up" | "down";
  className?: string;
}) {
  const directionMap = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: -50 },
    down: { x: 0, y: 50 }
  };
  
  const { x, y } = directionMap[direction];
  
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        duration, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedTitle({ 
  children, 
  className = "" 
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className={`text-2xl sm:text-3xl font-bold tracking-tight ${className}`}
    >
      {children}
    </motion.h1>
  );
}

export function AnimatedButton({ 
  children, 
  className = "" 
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredList({
  children,
  delay = 0,
  staggerDelay = 0.1,
  className = ""
}: {
  children: ReactNode[];
  delay?: number;
  staggerDelay?: number;
  className?: string;
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay
      }
    }
  };
  
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredItem({ 
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  return (
    <motion.div
      variants={item}
      className={className}
    >
      {children}
    </motion.div>
  );
} 