"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, CheckCircle, Play } from "lucide-react";
import { type Chapter } from "@/types";

interface CourseTopBarProps {
  currentChapter: Chapter;
  currentChapterIndex: number;
  totalChapters: number;
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export const CourseTopBar = ({
  currentChapter,
  currentChapterIndex,
  totalChapters,
  onMenuClick,
  sidebarOpen,
}: CourseTopBarProps) => (
  <div className="border-border bg-card flex h-14 items-center justify-between border-b px-4 lg:h-16 lg:px-6">
    <div className="flex items-center space-x-2 lg:space-x-4">
      {!sidebarOpen && (
        <Button variant="ghost" size="sm" onClick={onMenuClick}>
          <Menu className="h-4 w-4" />
        </Button>
      )}
      <div className="min-w-0">
        <h2 className="text-foreground truncate text-sm font-semibold lg:text-base">
          {currentChapter.title}
        </h2>
        <p className="text-muted-foreground text-xs lg:text-sm">
          Chapter {currentChapterIndex + 1} of {totalChapters}
        </p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <Badge variant="secondary" className="hidden text-xs sm:inline-flex">
        {currentChapter.duration}
      </Badge>
      <Button size="sm" disabled={currentChapter.completed}>
        {currentChapter.completed ? (
          <>
            <CheckCircle className="mr-1 h-4 w-4 lg:mr-2" />
            <span className="hidden sm:inline">Completed</span>
            <span className="sm:hidden">Done</span>
          </>
        ) : (
          <>
            <Play className="mr-1 h-4 w-4 lg:mr-2" />
            <span className="hidden sm:inline">Start</span>
            <span className="sm:hidden">Play</span>
          </>
        )}
      </Button>
    </div>
  </div>
);
