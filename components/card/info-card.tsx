import React, { forwardRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface InfoCardProps {
  title: string;
  value: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline" | "success";
  };
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  footer?: React.ReactNode;
  className?: string;

  // animation settings
  delay?: number;
  hover?: boolean;
  scale?: boolean;
}

export const InfoCard = forwardRef<HTMLDivElement, InfoCardProps>(
  (
    {
      title,
      value,
      description,
      icon,
      badge,
      trend,
      footer,
      className,

      delay = 0,
      hover = true,
      scale = true,
    },
    ref,
  ) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
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
    >
      <Card
        className={cn(
          "flex flex-col transition-all duration-300",
          hover && "hover:shadow-primary/10 hover:shadow-lg",
          className,
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon && <span className="text-muted-foreground">{icon}</span>}
          </div>
          {description && (
            <CardDescription className="pt-1">{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">{value}</div>
            {trend && (
              <p
                className={cn(
                  "text-muted-foreground text-xs",
                  trend.direction === "up"
                    ? "text-success"
                    : trend.direction === "down"
                      ? "text-destructive"
                      : "text-muted-foreground",
                )}
              >
                {trend.value}
              </p>
            )}
          </div>
          {badge && (
            <Badge
              variant={badge.variant ?? "default"}
              className="mt-2 text-xs"
            >
              {badge.text}
            </Badge>
          )}
        </CardContent>
        {footer && (
          <CardFooter className="text-muted-foreground text-xs">
            {footer}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  ),
);
