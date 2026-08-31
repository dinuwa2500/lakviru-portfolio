import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  honeypot: z.string().optional(), // Antispam honeypot trap
});

export const projectSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and dashes'),
  customTitle: z.string().min(2, 'Title is required').max(150),
  customDescription: z.string().min(5, 'Description is required').max(1000),
  category: z.string().min(2, 'Category is required'),
  status: z.enum(['HIDDEN', 'PUBLISHED', 'FEATURED', 'ARCHIVED']),
  isFeatured: z.boolean().default(false),
  isVisible: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  thumbnail: z.string().url('Must be a valid URL').or(z.literal('')).optional().nullable(),
  demoUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional().nullable(),
  problem: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  myRole: z.string().optional().nullable(),
  architecture: z.string().optional().nullable(),
  technologies: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  screenshots: z.array(z.string()).default([]),
});

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(50),
  category: z.enum(['LANGUAGES', 'FRONTEND', 'BACKEND', 'DATABASES', 'DEVOPS_CLOUD', 'TOOLS']),
  skillLevel: z.number().min(1).max(100).default(85),
  icon: z.string().optional().nullable(),
  description: z.string().max(300).optional().nullable(),
  displayOrder: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
});

export const experienceSchema = z.object({
  company: z.string().min(2, 'Company name is required'),
  position: z.string().min(2, 'Position title is required'),
  location: z.string().optional().nullable(),
  startDate: z.string().min(4, 'Start date is required (e.g. 2023-01)'),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().min(5, 'Description is required'),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  displayOrder: z.number().int().default(0),
});

export const educationSchema = z.object({
  institution: z.string().min(2, 'Institution is required'),
  degree: z.string().min(2, 'Degree is required'),
  field: z.string().min(2, 'Field of study is required'),
  location: z.string().optional().nullable(),
  startDate: z.string().min(4, 'Start year is required'),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional().nullable(),
  grade: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  primaryTitle: z.string().min(2, 'Title is required'),
  heroSubtitle: z.string().min(10, 'Hero subtitle is required'),
  bio: z.string().min(20, 'Bio is required'),
  location: z.string().min(2, 'Location is required'),
  email: z.string().email('Valid email required'),
  githubUrl: z.string().url('Must be a valid URL'),
  linkedinUrl: z.string().url('Must be a valid URL'),
  twitterUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional().nullable(),
  resumeUrl: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  isAvailableForWork: z.boolean().default(true),
});

export const settingsSchema = z.object({
  githubUsername: z.string().min(1, 'GitHub username is required'),
  githubToken: z.string().optional().nullable(),
});
