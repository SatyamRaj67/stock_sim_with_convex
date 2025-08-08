"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, BookOpen } from "lucide-react";
import type { Chapter } from "@/types";

interface CourseContentProps {
  currentChapter: Chapter;
}

export const CourseContent = ({
  currentChapter,
}: CourseContentProps) => (
  <div className="flex-1 overflow-y-auto p-4 lg:p-6">
    <div className="mx-auto max-w-4xl">
      {/* Video/Content Placeholder */}
      <Card className="mb-4 lg:mb-6">
        <CardContent className="p-0">
          <div className="bg-muted flex aspect-video items-center justify-center rounded-lg">
            <div className="p-4 text-center">
              <Play className="text-muted-foreground mx-auto mb-2 h-12 w-12 lg:mb-4 lg:h-16 lg:w-16" />
              <p className="text-foreground mb-1 text-base font-medium lg:text-lg">
                {currentChapter.title}
              </p>
              <p className="text-muted-foreground text-sm">
                {currentChapter.duration} video lesson
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chapter Description */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-base lg:text-lg">
            <BookOpen className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
            About this chapter
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed lg:mb-6 lg:text-base">
            In this chapter, you'll learn about the different types of stocks
            available in the market. We'll cover common stocks, preferred
            stocks, growth stocks, value stocks, and dividend stocks.
            Understanding these categories will help you make informed
            investment decisions based on your risk tolerance and investment
            goals.
          </p>

          <div className="space-y-3 lg:space-y-4">
            <h4 className="text-foreground text-sm font-semibold lg:text-base">
              What you'll learn:
            </h4>
            <ul className="text-muted-foreground space-y-2 text-sm lg:text-base">
              <li className="flex items-start">
                <div className="bg-primary mt-1.5 mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full lg:mt-2" />
                Common vs Preferred stocks and their characteristics
              </li>
              <li className="flex items-start">
                <div className="bg-primary mt-1.5 mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full lg:mt-2" />
                Growth stocks and how to identify them
              </li>
              <li className="flex items-start">
                <div className="bg-primary mt-1.5 mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full lg:mt-2" />
                Value investing strategies and value stock selection
              </li>
              <li className="flex items-start">
                <div className="bg-primary mt-1.5 mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full lg:mt-2" />
                Dividend stocks and income generation
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
