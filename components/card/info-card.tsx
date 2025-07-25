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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  footer?: React.ReactNode;
  className?: string;
  loading?: boolean;
  onClick?: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  description,
  icon,
  badge,
  footer,
  className,
  loading = false,
  onClick,
}) => {
  return (
    <Card
      className={cn(
        "transition-all duration-200",
        onClick && "hover:border-primary/20 cursor-pointer hover:shadow-md",
        className,
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>

      <CardContent>
        <div className="space-y-1">
          {loading ? (
            <Skeleton className="h-8 w-[100px]" />
          ) : (
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{value}</div>
              <div className="flex items-center gap-2">
                {badge && (
                  <Badge
                    variant={badge.variant || "default"}
                    className="text-xs"
                  >
                    {badge.text}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {description && (
            <CardDescription className="text-xs">
              {loading ? <Skeleton className="h-4 w-[150px]" /> : description}
            </CardDescription>
          )}
        </div>

        {footer && (
          <CardFooter className="mt-4 border-t pt-4">{footer}</CardFooter>
        )}
      </CardContent>
    </Card>
  );
};

export default InfoCard;
