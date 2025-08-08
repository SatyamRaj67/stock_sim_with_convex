import type { Course } from "@/types";

export const sampleCourses: Course[] = [
  {
    id: "1",
    title: "Stock Market Fundamentals",
    description:
      "Learn the basics of stock market investing and trading strategies.",
    image: "/api/placeholder/300/200",
    totalDuration: "4 weeks",
    level: "Beginner",
    instructor: "John Smith",
    tags: ["stocks", "investing", "basics", "portfolio", "finance"],
  },
  {
    id: "2",
    title: "Technical Analysis",
    description:
      "Master chart patterns and technical indicators for better trading decisions.",
    image: "/api/placeholder/300/200",
    totalDuration: "6 weeks",
    level: "Intermediate",
    instructor: "Sarah Johnson",
    tags: ["charts", "patterns", "indicators", "trading", "analysis"],
  },
  {
    id: "3",
    title: "Risk Management",
    description:
      "Learn how to protect your investments and manage portfolio risk effectively.",
    image: "/api/placeholder/300/200",
    totalDuration: "3 weeks",
    level: "Advanced",
    instructor: "Mike Davis",
    tags: ["risk", "protection", "portfolio", "management", "strategy"],
  },
  {
    id: "4",
    title: "Options Trading",
    description:
      "Understand options strategies and how to use derivatives in your portfolio.",
    image: "/api/placeholder/300/200",
    totalDuration: "8 weeks",
    level: "Advanced",
    instructor: "Lisa Chen",
    tags: ["options", "derivatives", "strategies", "advanced", "trading"],
  },
  {
    id: "5",
    title: "Portfolio Management",
    description:
      "Build and maintain a diversified investment portfolio for long-term growth.",
    image: "/api/placeholder/300/200",
    totalDuration: "5 weeks",
    level: "Intermediate",
    instructor: "Robert Wilson",
    tags: ["portfolio", "diversification", "growth", "management", "long-term"],
  },
  {
    id: "6",
    title: "Cryptocurrency Basics",
    description:
      "Introduction to digital currencies and blockchain technology investing.",
    image: "/api/placeholder/300/200",
    totalDuration: "4 weeks",
    level: "Beginner",
    instructor: "Emma Thompson",
    tags: ["crypto", "blockchain", "digital", "bitcoin", "technology"],
  },
];
