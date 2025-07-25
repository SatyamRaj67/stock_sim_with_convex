"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  ArrowLeft,
  Search,
  AlertTriangle,
  TrendingUp,
  BarChart3,
} from "lucide-react";

export default function NotFound() {
  const [glitchText, setGlitchText] = useState("404");

  useEffect(() => {
    const glitchChars = ["4", "0", "4", "█", "▓", "▒", "░"];
    let glitchInterval: NodeJS.Timeout;

    const startGlitch = () => {
      let count = 0;
      glitchInterval = setInterval(() => {
        if (count < 5) {
          const randomText = Array(3)
            .fill(0)
            .map(
              () => glitchChars[Math.floor(Math.random() * glitchChars.length)],
            )
            .join("");
          setGlitchText(randomText);
          count++;
        } else {
          setGlitchText("404");
          count = 0;
        }
      }, 150);
    };

    const glitchTimeout = setTimeout(startGlitch, 2000);

    return () => {
      clearInterval(glitchInterval);
      clearTimeout(glitchTimeout);
    };
  }, []);

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Cg fill=%22%23000%22 fill-opacity=%220.1%22%3E%3Cpath d=%22M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20.5H20z%22/%3E%3C/g%3E%3C/svg%3E')] absolute top-0 left-0 h-full w-full"></div>
      </div>

      {/* Floating Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float absolute top-[20%] left-[10%]">
          <TrendingUp className="text-muted-foreground/20 h-8 w-8 rotate-12" />
        </div>
        <div className="animate-float-delayed absolute top-[60%] right-[15%]">
          <BarChart3 className="text-muted-foreground/20 h-6 w-6 -rotate-12" />
        </div>
        <div className="animate-float absolute bottom-[30%] left-[20%]">
          <Search className="text-muted-foreground/20 h-5 w-5 rotate-45" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-2xl space-y-8 text-center">
        {/* 404 Header with Glitch Effect */}
        <div className="relative">
          <div className="text-foreground/10 text-[8rem] leading-none font-black select-none md:text-[12rem]">
            {glitchText}
          </div>
          <div className="text-foreground glitch-text absolute inset-0 text-[8rem] leading-none font-black md:text-[12rem]">
            404
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="bg-card/50 border-border/50 border shadow-2xl backdrop-blur-sm">
          <CardContent className="space-y-6 p-8">
            <div className="flex justify-center">
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Page Not Found
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="text-foreground text-3xl font-bold md:text-4xl">
                Oops! Page not found
              </h1>
              <p className="text-muted-foreground mx-auto max-w-md text-lg leading-relaxed">
                The page you're looking for seems to have vanished into the
                void. Don't worry, even the best traders sometimes take a wrong
                turn.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
              <Button asChild size="lg" className="min-w-[140px]">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-w-[140px]"
              >
                <Link href="/dashboard">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </div>

            {/* Help Links */}
            <div className="border-border/50 border-t pt-6">
              <p className="text-muted-foreground mb-4 text-sm">
                Need help? Try these popular pages:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/portfolio">Portfolio</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/market">Market</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/contact">Contact</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-5deg);
          }
        }

        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .glitch-text {
          animation: glitch 0.3s ease-in-out infinite alternate;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: "404";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .glitch-text::before {
          color: hsl(var(--destructive));
          z-index: -1;
          transform: translate(-2px, -2px);
          opacity: 0.8;
        }

        .glitch-text::after {
          color: hsl(var(--primary));
          z-index: -2;
          transform: translate(2px, 2px);
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
