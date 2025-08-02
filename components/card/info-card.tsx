import React from "react";
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
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  description,
  icon,
  badge,
  trend,
  footer,
  className,
}) => (
  <Card className={cn("flex flex-col", className)}>
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
        <Badge variant={badge.variant ?? "default"} className="mt-2 text-xs">
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
);
