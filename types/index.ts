import type { User } from "next-auth";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface ExtendedUser extends User {
  id: string;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
}

export interface UserPreferences {
  theme: "light" | "dark" | string;
}