"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, GraduationCap } from "lucide-react";
import { sampleCourses } from "@/constants/courses-data";
import MultipleSelector, {
  type Option,
} from "@/components/ui/multiple-selector";

export default function LearnPage() {
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [filteredCourses, setFilteredCourses] = useState(sampleCourses);

  // Get all unique tags from courses
  const getAllTags = (): Option[] => {
    const allTags = sampleCourses.flatMap((course) => course.tags);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.map((tag) => ({ value: tag, label: tag }));
  };

  const handleSearch = async (searchValue: string): Promise<Option[]> => {
    const allTags = getAllTags();

    if (!searchValue) {
      // Filter courses based on selected tags only
      filterCourses([]);
      return allTags;
    }

    // Return tags that match the search
    const matchingTags = allTags.filter((tag) =>
      tag.label.toLowerCase().includes(searchValue.toLowerCase()),
    );

    // Also search in course titles, descriptions, instructors
    const matchingCourseTerms = sampleCourses
      .filter(
        (course) =>
          course.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          course.description
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchValue.toLowerCase()) ||
          course.level.toLowerCase().includes(searchValue.toLowerCase()),
      )
      .flatMap((course) => course.tags)
      .filter((tag, index, self) => self.indexOf(tag) === index) 
      .map((tag) => ({ value: tag, label: tag }));

    // Combine and deduplicate
    const combinedTags = [...matchingTags, ...matchingCourseTerms];
    const uniqueTags = combinedTags.filter(
      (tag, index, self) =>
        self.findIndex((t) => t.value === tag.value) === index,
    );

    return uniqueTags;
  };

  const filterCourses = (tags: Option[]) => {
    if (tags.length === 0) {
      setFilteredCourses(sampleCourses);
      return;
    }

    const selectedTagValues = tags.map((tag) => tag.value);
    const filtered = sampleCourses.filter((course) =>
      selectedTagValues.some(
        (tag) =>
          course.tags.includes(tag) ||
          course.title.toLowerCase().includes(tag.toLowerCase()) ||
          course.description.toLowerCase().includes(tag.toLowerCase()) ||
          course.instructor.toLowerCase().includes(tag.toLowerCase()) ||
          course.level.toLowerCase().includes(tag.toLowerCase()),
      ),
    );
    setFilteredCourses(filtered);
  };

  const handleTagChange = (tags: Option[]) => {
    setSelectedTags(tags);
    filterCourses(tags);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold">
            Learn Trading & Investing
          </h1>
          <p className="text-muted-foreground text-xl">
            Master the markets with our comprehensive courses
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-full max-w-2xl">
            <Search className="text-muted-foreground absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2" />
            <MultipleSelector
              value={selectedTags}
              onChange={handleTagChange}
              placeholder="Search courses, topics, tags, or instructors..."
              className="py-4 pl-12 text-lg w-full"
              onSearch={handleSearch}
              creatable
              emptyIndicator={
                <p className="text-center text-lg leading-10 ">
                  No tags found.
                </p>
              }
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {selectedTags.length > 0 && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            <span className="text-muted-foreground text-sm">
              Active filters:
            </span>
            {selectedTags.map((tag) => (
              <Badge key={tag.value} variant="outline" className="text-xs">
                {tag.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Course Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg"
            >
              <CardHeader className="p-0">
                {/* Course Image */}
                <div className="bg-muted relative h-40 rounded-t-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
                        <GraduationCap className="text-primary h-6 w-6" />
                      </div>
                      <p className="text-muted-foreground text-xs font-medium">
                        {course.level}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5">
                {/* Level and Duration */}
                <div className="mb-3 flex items-center justify-between">
                  <Badge className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    {course.duration}
                  </span>
                </div>

                {/* Title and Description */}
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  {course.title}
                </h3>

                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {course.description}
                </p>

                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-1">
                  {course.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className={`hover:bg-secondary/80 cursor-pointer text-xs ${
                        selectedTags.some(
                          (selectedTag) => selectedTag.value === tag,
                        )
                          ? "bg-primary/20 text-primary"
                          : ""
                      }`}
                      onClick={() => {
                        const tagOption = { value: tag, label: tag };
                        if (
                          !selectedTags.some(
                            (selectedTag) => selectedTag.value === tag,
                          )
                        ) {
                          handleTagChange([...selectedTags, tagOption]);
                        }
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {course.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{course.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Instructor and Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="mr-3 h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {course.instructor
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground text-sm">
                      {course.instructor}
                    </span>
                  </div>
                  <Button size="sm">Start Course</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="py-12 text-center">
            <div className="mb-4">
              <Search className="text-muted-foreground mx-auto h-16 w-16" />
            </div>
            <h3 className="text-foreground mb-2 text-lg font-medium">
              No courses found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or browse different tags
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSelectedTags([]);
                setFilteredCourses(sampleCourses);
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
