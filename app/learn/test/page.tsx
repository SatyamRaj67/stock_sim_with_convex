"use client";

import { CourseContent } from "@/components/card/course-card";
import { CourseTopBar } from "@/components/layout/header/learn/course-top-bar";
import { CourseSidebar } from "@/components/layout/sidebar/learn/course-sidebar";
import type { Chapter, Course } from "@/types";
import React, { useState, useEffect } from "react";

const courseData: Course = {
  id: "1",
  title: "Stock Market Fundamentals",
  description:
    "Learn the basics of stock market investing and trading strategies.",
  instructor: ["John Smith"],
  level: "Beginner",
  totalDuration: "4 weeks",
  progress: 35,
  tags: ["Investing", "Trading", "Finance"],
  chapters: [
    {
      id: "1",
      title: "Introduction to Stock Markets",
      duration: "15 min",
      completed: true,
    },
    {
      id: "2",
      title: "Understanding Stock Exchanges",
      duration: "20 min",
      completed: true,
    },
    {
      id: "3",
      title: "Types of Stocks",
      duration: "18 min",
      completed: false,
      current: true,
    },
    {
      id: "4",
      title: "How to Read Stock Charts",
      duration: "25 min",
      completed: false,
    },
    {
      id: "5",
      title: "Fundamental Analysis Basics",
      duration: "30 min",
      completed: false,
    },
    {
      id: "6",
      title: "Technical Analysis Introduction",
      duration: "28 min",
      completed: false,
    },
    {
      id: "7",
      title: "Risk Management Principles",
      duration: "22 min",
      completed: false,
    },
    {
      id: "8",
      title: "Building Your First Portfolio",
      duration: "35 min",
      completed: false,
    },
  ],
};

const TestPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<Chapter>(
    courseData.chapters.find((ch) => ch.current) || courseData.chapters![0]!,
  );

  // Auto-close sidebar on mobile when chapter changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [currentChapter]);

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentChapterIndex = courseData.chapters.findIndex(
    (ch) => ch.id === currentChapter.id,
  );
  const canGoPrevious = currentChapterIndex > 0;
  const canGoNext = currentChapterIndex < courseData.chapters.length - 1;

  const goToPreviousChapter = () => {
    if (canGoPrevious) {
      setCurrentChapter(courseData.chapters![currentChapterIndex - 1]!);
    }
  };

  const goToNextChapter = () => {
    if (canGoNext) {
      setCurrentChapter(courseData.chapters![currentChapterIndex + 1]!);
    }
  };

  return (
    <div className="bg-background flex h-screen">
      <CourseSidebar
        course={courseData}
        currentChapter={currentChapter}
        onChapterSelect={setCurrentChapter}
        onPrevious={goToPreviousChapter}
        onNext={goToNextChapter}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <CourseTopBar
          currentChapter={currentChapter}
          currentChapterIndex={currentChapterIndex}
          totalChapters={courseData.chapters.length}
          onMenuClick={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
        />

        <CourseContent currentChapter={currentChapter} />
      </div>
    </div>
  );
};

export default TestPage;
