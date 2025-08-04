"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TbHome, TbArrowLeft, TbTrendingUp } from "react-icons/tb";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="from-background via-background/80 to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        {/* Animated 404 */}
        <div className="relative">
          <div className="text-muted-foreground/20 text-[12rem] leading-none font-bold select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-bounce">
              <TbTrendingUp className="text-primary h-24 w-24" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Portfolio Not Found
          </h1>
          <p className="text-muted-foreground mx-auto max-w-md text-xl">
            Looks like this stock has delisted.The page you&apos;re looking for
            seems to have gone bearish.
          </p>
        </div>

        {/* Fun Stock-themed Message */}
        <div className="bg-card mx-auto max-w-md rounded-lg border p-6">
          <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
            Market Status: Page Not Found
          </div>
          <div className="font-mono text-2xl">
            Error: <span className="text-red-500">-100%</span>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            This URL&apos;s performance is down significantly
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <TbArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">
              <TbHome className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="border-t pt-8">
          <p className="text-muted-foreground mb-4 text-sm">
            Or explore these popular sections:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/stocks">Browse Stocks</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/portfolio">My Portfolio</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/watchlist">Watchlist</Link>
            </Button>
          </div>
        </div>

        {/* Floating Elements Animation */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="bg-primary/20 absolute top-1/4 left-1/4 h-2 w-2 animate-ping rounded-full"></div>
          <div className="bg-primary/30 absolute top-3/4 right-1/4 h-1 w-1 animate-pulse rounded-full"></div>
          <div className="bg-primary/10 absolute top-1/2 left-3/4 h-3 w-3 animate-bounce rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
