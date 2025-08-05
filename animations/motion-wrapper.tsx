"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import React from "react";

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  hover?: boolean;
  scale?: boolean;
  variant?: "slide-up" | "slide-down" | "slide-left" | "slide-right" | "fade" | "scale";
}

export const MotionWrapper = React.forwardRef<HTMLDivElement, MotionWrapperProps>(
  ({ 
    children, 
    delay = 0, 
    hover = true, 
    scale = true, 
    variant = "slide-up",
    className,
    ...props 
  }, ref) => {
    const variants = {
      "slide-up": {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      },
      "slide-down": {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
      },
      "slide-left": {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
      },
      "slide-right": {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
      },
      "fade": {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      },
      "scale": {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
      },
    };

    return (
      <motion.div
        ref={ref}
        initial={variants[variant].initial}
        animate={variants[variant].animate}
        transition={{
          duration: 0.6,
          delay,
          ease: [0.4, 0, 0.2, 1],
        }}
        whileHover={
          hover
            ? {
                y: -5,
                scale: scale ? 1.02 : 1,
                transition: { duration: 0.2 },
              }
            : undefined
        }
        whileTap={hover ? { scale: scale ? 0.98 : 1 } : undefined}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

MotionWrapper.displayName = "MotionWrapper";