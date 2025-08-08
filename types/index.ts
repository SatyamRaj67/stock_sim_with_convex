export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface Chapter {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  current?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  instructor?: string[];
  image?: string;
  level: string;
  totalDuration?: string;
  progress: number;
  tags?: string[];
  chapters: Chapter[];
}
