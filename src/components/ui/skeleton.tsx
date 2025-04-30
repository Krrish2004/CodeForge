"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <motion.div 
      className={`bg-secondary/50 animate-pulse rounded ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }}
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  );
}

export function PulseContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div 
      className={className}
      animate={{ opacity: [0.85, 1, 0.85] }}
      transition={{ 
        duration: 2, 
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
} 