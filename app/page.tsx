"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  Shield,
  Zap,
  ArrowRight,
  Play,
  Star,
  Users,
  Award,
} from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      );

      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out" },
      );

      gsap.fromTo(
        ".hero-buttons",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: "power3.out" },
      );

      // Features animation
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
          },
        },
      );

      // Stats animation
      gsap.fromTo(
        ".stat-item",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          },
        },
      );

      // CTA animation
      gsap.fromTo(
        ".cta-content",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
          },
        },
      );

      // Floating animation for icons
      gsap.to(".floating-icon", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        stagger: 0.2,
      });
    });

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Real-Time Analytics",
      description:
        "Track market movements with live data and advanced charting tools.",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Portfolio Management",
      description:
        "Optimize your investments with intelligent portfolio analysis.",
    },
    {
      icon: <PieChart className="h-8 w-8" />,
      title: "Risk Assessment",
      description:
        "Evaluate and manage investment risks with AI-powered insights.",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Smart Predictions",
      description: "Make informed decisions with machine learning predictions.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Trading",
      description: "Trade with confidence using bank-level security protocols.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description:
        "Execute trades at market speed with our optimized platform.",
    },
  ];

  const stats = [
    {
      icon: <Users className="h-6 w-6" />,
      value: "50K+",
      label: "Active Traders",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      value: "$2.5B",
      label: "Volume Traded",
    },
    { icon: <Award className="h-6 w-6" />, value: "99.9%", label: "Uptime" },
    {
      icon: <Star className="h-6 w-6" />,
      value: "4.9/5",
      label: "User Rating",
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
      >
        <div className="from-background via-background to-muted/20 absolute inset-0 bg-gradient-to-br" />

        {/* Floating background elements */}
        <div className="floating-icon absolute top-20 left-10">
          <TrendingUp className="text-muted-foreground/20 h-16 w-16" />
        </div>
        <div className="floating-icon absolute top-40 right-20">
          <BarChart3 className="text-muted-foreground/20 h-20 w-20" />
        </div>
        <div className="floating-icon absolute bottom-40 left-20">
          <PieChart className="text-muted-foreground/20 h-12 w-12" />
        </div>

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

          <div className="hero-buttons flex flex-col items-center justify-center gap-4 sm:flex-row">
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

      {/* Stats Section */}
      <section ref={statsRef} className="bg-muted/50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-center">
                <Card className="border-0 bg-transparent">
                  <CardContent className="pt-6">
                    <div className="text-primary mb-4 flex justify-center">
                      {stat.icon}
                    </div>
                    <div className="mb-2 text-3xl font-bold">{stat.value}</div>
                    <div className="text-muted-foreground text-sm">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Powerful Features</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              Everything you need to make smarter investment decisions and
              maximize your returns.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="feature-card group border-muted transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="text-primary mb-4 transition-transform group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="bg-muted/50 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="cta-content">
            <h2 className="mb-6 text-4xl font-bold">
              Ready to Start Trading Smarter?
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
              Join thousands of successful traders who trust SmartStock for
              their investment journey.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="group">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
