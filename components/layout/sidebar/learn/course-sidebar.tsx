"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Play,
  Clock,
  X,
} from "lucide-react";
import type { Chapter, Course } from "@/types";

type CourseSidebarProps = {
  course: Course;
  currentChapter: Chapter;
  onChapterSelect: (chapter: Chapter) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isOpen: boolean;
  onClose: () => void;
};

export const CourseSidebar = ({
  course,
  currentChapter,
  onChapterSelect,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isOpen,
  onClose,
}: CourseSidebarProps) => {
  const completedChapters = course.chapters.filter((ch) => ch.completed).length;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto ${isOpen ? "w-80" : "w-0 lg:w-0"} border-border bg-card overflow-hidden border-r transition-all duration-300 lg:flex lg:flex-col`}
      >
        <div className="flex h-full flex-col">
          {/* Course Header */}
          <div className="border-border border-b p-4 lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-foreground line-clamp-2 text-base font-bold lg:text-lg">
                {course.title}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Instructor */}
            <div className="mb-4 flex items-center">
              <Avatar className="mr-3 h-8 w-8">
                <AvatarFallback className="text-xs">
                  {course
                    .instructor![0]!.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-foreground text-sm font-medium">
                  {course.instructor}
                </p>
                <p className="text-muted-foreground text-xs">
                  {course.level} • {course.totalDuration}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">
                  {completedChapters}/{course.chapters.length} chapters
                </span>
              </div>
              <Progress value={course.progress} className="h-2" />
              <p className="text-muted-foreground text-xs">
                {course.progress}% completed
              </p>
            </div>
          </div>

          {/* Chapter List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-foreground mb-3 text-sm font-semibold">
                Course Content
              </h3>
              <div className="space-y-2">
                {course.chapters.map((chapter, index) => (
                  <ChapterItem
                    key={chapter.id}
                    chapter={chapter}
                    index={index}
                    isActive={currentChapter.id === chapter.id}
                    onClick={() => onChapterSelect(chapter)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="border-border border-t p-4">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className="flex-1"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </Button>
              <Button
                size="sm"
                onClick={onNext}
                disabled={!canGoNext}
                className="flex-1"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface ChapterItemProps {
  chapter: Chapter;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
  index,
  isActive,
  onClick,
}) => (
  <div
    className={`cursor-pointer rounded-lg border p-3 transition-colors ${
      isActive
        ? "bg-primary/10 border-primary/20"
        : "bg-background border-border hover:bg-muted/50"
    }`}
    onClick={onClick}
  >
    <div className="flex items-start space-x-3">
      <div className="mt-0.5 flex-shrink-0">
        {chapter.completed ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : isActive ? (
          <Play className="text-primary h-4 w-4" />
        ) : (
          <div className="border-muted-foreground/30 h-4 w-4 rounded-full border-2" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}
        >
          {index + 1}. {chapter.title}
        </p>
        <div className="text-muted-foreground mt-1 flex items-center text-xs">
          <Clock className="mr-1 h-3 w-3" />
          {chapter.duration}
        </div>
      </div>
    </div>
  </div>
);
