// TypeScript Definitions for Lakviru Perera's Software Engineer Portfolio & CMS

export type ProjectStatus = 'HIDDEN' | 'PUBLISHED' | 'FEATURED' | 'ARCHIVED';

export type SkillCategory =
  | 'LANGUAGES'
  | 'FRONTEND'
  | 'BACKEND'
  | 'DATABASES'
  | 'DEVOPS_CLOUD'
  | 'TOOLS';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ProfileData {
  id: string;
  name: string;
  primaryTitle: string;
  heroSubtitle: string;
  bio: string;
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl?: string | null;
  resumeUrl?: string | null;
  avatarUrl?: string | null;
  isAvailableForWork: boolean;
  updatedAt: Date | string;
}

export interface ProjectData {
  id: string;
  slug: string;
  githubRepoId?: number | null;
  githubName?: string | null;
  githubFullName?: string | null;
  githubUrl?: string | null;
  githubDescription?: string | null;
  githubStars: number;
  githubForks: number;
  githubLanguage?: string | null;
  githubLanguages: string[]; // parsed from JSON string
  githubTopics: string[]; // parsed from JSON string
  githubReadme?: string | null;
  githubCreatedAt?: Date | string | null;
  githubUpdatedAt?: Date | string | null;

  // Custom portfolio overrides
  customTitle?: string | null;
  customDescription?: string | null;
  category: string;
  status: ProjectStatus;
  isFeatured: boolean;
  isVisible: boolean;
  displayOrder: number;
  thumbnail?: string | null;
  screenshots: string[]; // parsed from JSON string
  problem?: string | null;
  solution?: string | null;
  myRole?: string | null;
  features: string[]; // parsed from JSON string
  demoUrl?: string | null;
  architecture?: string | null;
  technologies: string[]; // parsed from JSON string
  lastSyncedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SkillData {
  id: string;
  name: string;
  category: SkillCategory;
  skillLevel?: number | null;
  icon?: string | null;
  description?: string | null;
  displayOrder: number;
  isFeatured: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ExperienceData {
  id: string;
  company: string;
  position: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description: string;
  responsibilities: string[]; // parsed from JSON
  achievements: string[]; // parsed from JSON
  technologies: string[]; // parsed from JSON
  displayOrder: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface EducationData {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string | null;
  grade?: string | null;
  displayOrder: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ContactMessageData {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  ipHash?: string | null;
  createdAt: Date | string;
}

export interface SyncLogData {
  id: string;
  triggerType: string;
  status: string;
  reposFound: number;
  reposNew: number;
  reposUpdated: number;
  reposUnchanged: number;
  errorMessage?: string | null;
  startedAt: Date | string;
  completedAt?: Date | string | null;
}

export interface GitHubRepoApiResponse {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  archived: boolean;
  fork: boolean;
  private: boolean;
  license?: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubSyncResult {
  success: boolean;
  reposFound: number;
  reposNew: number;
  reposUpdated: number;
  reposUnchanged: number;
  message: string;
  timestamp: string;
  error?: string;
}

export interface GitHubContributionStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  topLanguages: { name: string; percentage: number; color?: string }[];
  publicGists: number;
  followers: number;
  avatarUrl: string;
  bio: string;
}
