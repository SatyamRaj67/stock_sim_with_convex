"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="from-background via-background to-muted/20 relative inset-0 flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br px-4">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="hero-title mb-6">
            <Zap className="mr-2 h-4 w-4" />
            Next-Generation Trading Platform
          </Badge>

          <h1 className="hero-title from-foreground to-muted-foreground mb-6 bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
            Smart<span className="text-primary">Stock</span>
          </h1>

          <p className="hero-subtitle text-muted-foreground mx-auto mb-8 max-w-2xl text-xl leading-relaxed md:text-2xl">
            Experience the future of stock trading with AI-powered insights,
            real-time analytics, and intelligent portfolio management.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group">
              <Link href="/dashboard" className="flex items-center">
                Start Trading Now
              </Link>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="group">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
