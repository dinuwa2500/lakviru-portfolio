import {
  INITIAL_PROFILE,
  INITIAL_PROJECTS,
  INITIAL_SKILLS,
  INITIAL_EXPERIENCES,
  INITIAL_EDUCATIONS,
} from './seed-data';
import {
  ProfileData,
  ProjectData,
  SkillData,
  ExperienceData,
  EducationData,
  ContactMessageData,
  SyncLogData,
} from '@/types';
import { safeJsonStringify } from './utils';

// Safe PrismaClient resolver that works whether generated or before first generation
let PrismaClientConstructor: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const prismaPkg = require('@prisma/client');
  PrismaClientConstructor = prismaPkg.PrismaClient;
} catch {
  PrismaClientConstructor = null;
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: any;
  // eslint-disable-next-line no-var
  var memoryStoreGlobal: MemoryStore | undefined;
}

// In-Memory Fallback Store (Ensures zero-crash development & fallback resilience)
class MemoryStore {
  profile: ProfileData = { ...INITIAL_PROFILE };
  projects: ProjectData[] = [...INITIAL_PROJECTS];
  skills: SkillData[] = [...INITIAL_SKILLS];
  experiences: ExperienceData[] = [...INITIAL_EXPERIENCES];
  educations: EducationData[] = [...INITIAL_EDUCATIONS];
  messages: ContactMessageData[] = [];
  syncLogs: SyncLogData[] = [
    {
      id: 'sync-init',
      triggerType: 'INITIAL',
      status: 'SUCCESS',
      reposFound: INITIAL_PROJECTS.length,
      reposNew: INITIAL_PROJECTS.length,
      reposUpdated: 0,
      reposUnchanged: 0,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    },
  ];
  settings: Record<string, string> = {
    GITHUB_USERNAME: process.env.GITHUB_USERNAME || 'lakviruperera',
    NEXT_PUBLIC_SITE_NAME: 'Lakviru Perera | Software Engineer',
    AUTO_SYNC_ENABLED: 'true',
  };
}

export const memoryStore = globalThis.memoryStoreGlobal || new MemoryStore();
if (process.env.NODE_ENV !== 'production') {
  globalThis.memoryStoreGlobal = memoryStore;
}

export const prisma =
  globalThis.prismaGlobal ||
  (PrismaClientConstructor
    ? new PrismaClientConstructor({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
    : null);

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalThis.prismaGlobal = prisma;
}

// Check if PostgreSQL database is reachable with 30s caching to avoid redundant roundtrips
let dbConnectedCached: boolean | null = null;
let lastDbCheckTime = 0;
const DB_CHECK_TTL = 30000;

export async function isDbConnected(): Promise<boolean> {
  if (!prisma) return false;
  const now = Date.now();
  if (dbConnectedCached !== null && now - lastDbCheckTime < DB_CHECK_TTL) {
    return dbConnectedCached;
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbConnectedCached = true;
    lastDbCheckTime = now;
    return true;
  } catch {
    dbConnectedCached = false;
    lastDbCheckTime = now;
    return false;
  }
}

let isSeededChecked = false;

async function ensureDatabaseSeeded(): Promise<void> {
  if (isSeededChecked || !prisma) return;
  try {
    const count = await prisma.project.count();
    if (count === 0) {
      // Auto-populate initial verified data into new database tables
      const profileCount = await prisma.profile.count();
      if (profileCount === 0) {
        await prisma.profile.create({ data: { ...INITIAL_PROFILE } });
      }

      for (const p of INITIAL_PROJECTS) {
        await prisma.project.create({
          data: {
            slug: p.slug,
            githubRepoId: p.githubRepoId,
            githubName: p.githubName,
            githubFullName: p.githubFullName,
            githubUrl: p.githubUrl,
            githubDescription: p.githubDescription,
            githubStars: p.githubStars,
            githubForks: p.githubForks,
            githubLanguage: p.githubLanguage,
            githubLanguages: JSON.stringify(p.githubLanguages || []),
            githubTopics: JSON.stringify(p.githubTopics || []),
            customTitle: p.customTitle,
            customDescription: p.customDescription,
            category: p.category,
            status: p.status,
            isFeatured: p.isFeatured,
            isVisible: p.isVisible,
            displayOrder: p.displayOrder,
            thumbnail: p.thumbnail,
            screenshots: JSON.stringify(p.screenshots || []),
            problem: p.problem,
            solution: p.solution,
            myRole: p.myRole,
            features: JSON.stringify(p.features || []),
            demoUrl: p.demoUrl,
            architecture: p.architecture,
            technologies: JSON.stringify(p.technologies || []),
          },
        });
      }

      for (const s of INITIAL_SKILLS) {
        await prisma.skill.create({
          data: {
            name: s.name,
            category: s.category,
            skillLevel: s.skillLevel,
            icon: s.icon,
            description: s.description,
            displayOrder: s.displayOrder,
            isFeatured: s.isFeatured,
          },
        });
      }

      for (const e of INITIAL_EXPERIENCES) {
        await prisma.experience.create({
          data: {
            company: e.company,
            position: e.position,
            location: e.location,
            startDate: e.startDate,
            endDate: e.endDate,
            isCurrent: e.isCurrent,
            description: e.description,
            responsibilities: JSON.stringify(e.responsibilities || []),
            achievements: JSON.stringify(e.achievements || []),
            technologies: JSON.stringify(e.technologies || []),
            displayOrder: e.displayOrder,
          },
        });
      }

      for (const edu of INITIAL_EDUCATIONS) {
        await prisma.education.create({
          data: {
            institution: edu.institution,
            degree: edu.degree,
            field: edu.field,
            location: edu.location,
            startDate: edu.startDate,
            endDate: edu.endDate,
            isCurrent: edu.isCurrent,
            description: edu.description,
            grade: edu.grade,
            displayOrder: edu.displayOrder,
          },
        });
      }
    }
    isSeededChecked = true;
  } catch {
    // Non-blocking fallback
  }
}

// Data Access Layer with Automatic DB / Memory Resolution

export const dbService = {
  // PROFILE
  async getProfile(): Promise<ProfileData> {
    try {
      if (await isDbConnected()) {
        await ensureDatabaseSeeded();
        const p = await prisma.profile.findFirst();
        if (p) return p as unknown as ProfileData;
      }
    } catch (e) {
      console.warn('Fallback to memory store for profile:', e);
    }
    return memoryStore.profile;
  },

  async updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
    try {
      if (await isDbConnected()) {
        const existing = await prisma.profile.findFirst();
        if (existing) {
          const updated = await prisma.profile.update({
            where: { id: existing.id },
            data: { ...data, updatedAt: new Date() },
          });
          return updated as unknown as ProfileData;
        } else {
          const created = await prisma.profile.create({
            data: { ...INITIAL_PROFILE, ...data },
          });
          return created as unknown as ProfileData;
        }
      }
    } catch (e) {
      console.warn('Fallback to memory store for profile update:', e);
    }
    memoryStore.profile = {
      ...memoryStore.profile,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return memoryStore.profile;
  },

  // PROJECTS
  async getProjects(options?: {
    includeHidden?: boolean;
    featuredOnly?: boolean;
    category?: string;
  }): Promise<ProjectData[]> {
    try {
      if (await isDbConnected()) {
        const where: any = {};
        if (!options?.includeHidden) {
          where.isVisible = true;
          where.status = { not: 'HIDDEN' };
        }
        if (options?.featuredOnly) {
          where.isFeatured = true;
          where.isVisible = true;
        }
        if (options?.category && options.category !== 'All') {
          where.category = options.category;
        }

        const list = await prisma.project.findMany({
          where,
          orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }, { githubStars: 'desc' }],
        });

        if (list && list.length > 0) {
          return list.map((p: any) => ({
            ...p,
            githubLanguages: JSON.parse(p.githubLanguages || '[]'),
            githubTopics: JSON.parse(p.githubTopics || '[]'),
            screenshots: JSON.parse(p.screenshots || '[]'),
            features: JSON.parse(p.features || '[]'),
            technologies: JSON.parse(p.technologies || '[]'),
          })) as unknown as ProjectData[];
        }
      }
    } catch (e) {
      console.warn('Fallback to memory store for projects:', e);
    }

    let result = [...memoryStore.projects];
    if (!options?.includeHidden) {
      result = result.filter((p) => p.isVisible && p.status !== 'HIDDEN');
    }
    if (options?.featuredOnly) {
      result = result.filter((p) => p.isFeatured && p.isVisible);
    }
    if (options?.category && options.category !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === options.category?.toLowerCase());
    }

    return result.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
      return (b.githubStars || 0) - (a.githubStars || 0);
    });
  },

  async getProjectBySlug(slug: string): Promise<ProjectData | null> {
    try {
      if (await isDbConnected()) {
        const p = await prisma.project.findUnique({ where: { slug } });
        if (p) {
          return {
            ...p,
            githubLanguages: JSON.parse(p.githubLanguages || '[]'),
            githubTopics: JSON.parse(p.githubTopics || '[]'),
            screenshots: JSON.parse(p.screenshots || '[]'),
            features: JSON.parse(p.features || '[]'),
            technologies: JSON.parse(p.technologies || '[]'),
          } as unknown as ProjectData;
        }
      }
    } catch (e) {
      console.warn('Fallback to memory store for project by slug:', e);
    }

    const proj = memoryStore.projects.find((p) => p.slug === slug);
    return proj || null;
  },

  async getProjectById(id: string): Promise<ProjectData | null> {
    try {
      if (await isDbConnected()) {
        const p = await prisma.project.findUnique({ where: { id } });
        if (p) {
          return {
            ...p,
            githubLanguages: JSON.parse(p.githubLanguages || '[]'),
            githubTopics: JSON.parse(p.githubTopics || '[]'),
            screenshots: JSON.parse(p.screenshots || '[]'),
            features: JSON.parse(p.features || '[]'),
            technologies: JSON.parse(p.technologies || '[]'),
          } as unknown as ProjectData;
        }
      }
    } catch (e) {
      console.warn('Fallback to memory store for project by id:', e);
    }

    const proj = memoryStore.projects.find((p) => p.id === id);
    return proj || null;
  },

  async createProject(data: Partial<ProjectData>): Promise<ProjectData> {
    const newId = `proj-${Date.now()}`;
    const newSlug = data.slug || `project-${Date.now()}`;
    const projectRecord: ProjectData = {
      id: newId,
      slug: newSlug,
      category: data.category || 'Full-Stack',
      status: data.status || 'PUBLISHED',
      isFeatured: data.isFeatured ?? false,
      isVisible: data.isVisible ?? true,
      displayOrder: data.displayOrder ?? memoryStore.projects.length + 1,
      githubStars: data.githubStars ?? 0,
      githubForks: data.githubForks ?? 0,
      githubLanguages: data.githubLanguages || [],
      githubTopics: data.githubTopics || [],
      screenshots: data.screenshots || [],
      features: data.features || [],
      technologies: data.technologies || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    try {
      if (await isDbConnected()) {
        const created = await prisma.project.create({
          data: {
            ...projectRecord,
            githubLanguages: safeJsonStringify(projectRecord.githubLanguages),
            githubTopics: safeJsonStringify(projectRecord.githubTopics),
            screenshots: safeJsonStringify(projectRecord.screenshots),
            features: safeJsonStringify(projectRecord.features),
            technologies: safeJsonStringify(projectRecord.technologies),
          },
        });
        return {
          ...created,
          githubLanguages: JSON.parse(created.githubLanguages || '[]'),
          githubTopics: JSON.parse(created.githubTopics || '[]'),
          screenshots: JSON.parse(created.screenshots || '[]'),
          features: JSON.parse(created.features || '[]'),
          technologies: JSON.parse(created.technologies || '[]'),
        } as unknown as ProjectData;
      }
    } catch (e) {
      console.warn('Fallback to memory store for project creation:', e);
    }

    memoryStore.projects.unshift(projectRecord);
    return projectRecord;
  },

  async updateProject(id: string, data: Partial<ProjectData>): Promise<ProjectData | null> {
    try {
      if (await isDbConnected()) {
        const updatePayload: any = { ...data, updatedAt: new Date() };
        if (data.githubLanguages) updatePayload.githubLanguages = safeJsonStringify(data.githubLanguages);
        if (data.githubTopics) updatePayload.githubTopics = safeJsonStringify(data.githubTopics);
        if (data.screenshots) updatePayload.screenshots = safeJsonStringify(data.screenshots);
        if (data.features) updatePayload.features = safeJsonStringify(data.features);
        if (data.technologies) updatePayload.technologies = safeJsonStringify(data.technologies);

        const updated = await prisma.project.update({
          where: { id },
          data: updatePayload,
        });

        return {
          ...updated,
          githubLanguages: JSON.parse(updated.githubLanguages || '[]'),
          githubTopics: JSON.parse(updated.githubTopics || '[]'),
          screenshots: JSON.parse(updated.screenshots || '[]'),
          features: JSON.parse(updated.features || '[]'),
          technologies: JSON.parse(updated.technologies || '[]'),
        } as unknown as ProjectData;
      }
    } catch (e) {
      console.warn('Fallback to memory store for project update:', e);
    }

    const index = memoryStore.projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      memoryStore.projects[index] = {
        ...memoryStore.projects[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return memoryStore.projects[index];
    }
    return null;
  },

  async deleteProject(id: string): Promise<boolean> {
    try {
      if (await isDbConnected()) {
        await prisma.project.delete({ where: { id } });
        return true;
      }
    } catch (e) {
      console.warn('Fallback to memory store for project deletion:', e);
    }

    const initialLength = memoryStore.projects.length;
    memoryStore.projects = memoryStore.projects.filter((p) => p.id !== id);
    return memoryStore.projects.length < initialLength;
  },

  // SKILLS
  async getSkills(): Promise<SkillData[]> {
    try {
      if (await isDbConnected()) {
        const list = await prisma.skill.findMany({
          orderBy: [{ displayOrder: 'asc' }],
        });
        if (list && list.length > 0) return list as unknown as SkillData[];
      }
    } catch (e) {
      console.warn('Fallback to memory store for skills:', e);
    }
    return [...memoryStore.skills].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async createSkill(data: Partial<SkillData>): Promise<SkillData> {
    const newSkill: SkillData = {
      id: `sk-${Date.now()}`,
      name: data.name || 'New Skill',
      category: data.category || 'LANGUAGES',
      skillLevel: data.skillLevel ?? 80,
      icon: data.icon || 'Code',
      description: data.description || '',
      displayOrder: data.displayOrder ?? memoryStore.skills.length + 1,
      isFeatured: data.isFeatured ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    try {
      if (await isDbConnected()) {
        const created = await prisma.skill.create({ data: newSkill as any });
        return created as unknown as SkillData;
      }
    } catch (e) {
      console.warn('Fallback to memory store for create skill:', e);
    }

    memoryStore.skills.push(newSkill);
    return newSkill;
  },

  async updateSkill(id: string, data: Partial<SkillData>): Promise<SkillData | null> {
    try {
      if (await isDbConnected()) {
        const updated = await prisma.skill.update({
          where: { id },
          data: { ...data, updatedAt: new Date() },
        });
        return updated as unknown as SkillData;
      }
    } catch (e) {
      console.warn('Fallback to memory store for update skill:', e);
    }

    const idx = memoryStore.skills.findIndex((s) => s.id === id);
    if (idx !== -1) {
      memoryStore.skills[idx] = { ...memoryStore.skills[idx], ...data, updatedAt: new Date().toISOString() };
      return memoryStore.skills[idx];
    }
    return null;
  },

  async deleteSkill(id: string): Promise<boolean> {
    try {
      if (await isDbConnected()) {
        await prisma.skill.delete({ where: { id } });
        return true;
      }
    } catch (e) {
      console.warn('Fallback to memory store for delete skill:', e);
    }
    const len = memoryStore.skills.length;
    memoryStore.skills = memoryStore.skills.filter((s) => s.id !== id);
    return memoryStore.skills.length < len;
  },

  // EXPERIENCES
  async getExperiences(): Promise<ExperienceData[]> {
    try {
      if (await isDbConnected()) {
        const list = await prisma.experience.findMany({
          orderBy: [{ displayOrder: 'asc' }],
        });
        if (list && list.length > 0) {
          return list.map((e: any) => ({
            ...e,
            responsibilities: JSON.parse(e.responsibilities || '[]'),
            achievements: JSON.parse(e.achievements || '[]'),
            technologies: JSON.parse(e.technologies || '[]'),
          })) as unknown as ExperienceData[];
        }
      }
    } catch (e) {
      console.warn('Fallback to memory store for experiences:', e);
    }

    return [...memoryStore.experiences].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async createExperience(data: Partial<ExperienceData>): Promise<ExperienceData> {
    const newExp: ExperienceData = {
      id: `exp-${Date.now()}`,
      company: data.company || 'Company',
      position: data.position || 'Software Engineer',
      startDate: data.startDate || '2024-01',
      endDate: data.endDate || 'Present',
      isCurrent: data.isCurrent ?? false,
      description: data.description || '',
      responsibilities: data.responsibilities || [],
      achievements: data.achievements || [],
      technologies: data.technologies || [],
      displayOrder: data.displayOrder ?? memoryStore.experiences.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    try {
      if (await isDbConnected()) {
        const created = await prisma.experience.create({
          data: {
            ...newExp,
            responsibilities: safeJsonStringify(newExp.responsibilities),
            achievements: safeJsonStringify(newExp.achievements),
            technologies: safeJsonStringify(newExp.technologies),
          },
        });
        return {
          ...created,
          responsibilities: JSON.parse(created.responsibilities || '[]'),
          achievements: JSON.parse(created.achievements || '[]'),
          technologies: JSON.parse(created.technologies || '[]'),
        } as unknown as ExperienceData;
      }
    } catch (e) {
      console.warn('Fallback to memory store for create experience:', e);
    }

    memoryStore.experiences.push(newExp);
    return newExp;
  },

  async updateExperience(id: string, data: Partial<ExperienceData>): Promise<ExperienceData | null> {
    try {
      if (await isDbConnected()) {
        const payload: any = { ...data, updatedAt: new Date() };
        if (data.responsibilities) payload.responsibilities = safeJsonStringify(data.responsibilities);
        if (data.achievements) payload.achievements = safeJsonStringify(data.achievements);
        if (data.technologies) payload.technologies = safeJsonStringify(data.technologies);

        const updated = await prisma.experience.update({
          where: { id },
          data: payload,
        });

        return {
          ...updated,
          responsibilities: JSON.parse(updated.responsibilities || '[]'),
          achievements: JSON.parse(updated.achievements || '[]'),
          technologies: JSON.parse(updated.technologies || '[]'),
        } as unknown as ExperienceData;
      }
    } catch (e) {
      console.warn('Fallback to memory store for update experience:', e);
    }

    const idx = memoryStore.experiences.findIndex((e) => e.id === id);
    if (idx !== -1) {
      memoryStore.experiences[idx] = { ...memoryStore.experiences[idx], ...data, updatedAt: new Date().toISOString() };
      return memoryStore.experiences[idx];
    }
    return null;
  },

  async deleteExperience(id: string): Promise<boolean> {
    try {
      if (await isDbConnected()) {
        await prisma.experience.delete({ where: { id } });
        return true;
      }
    } catch (e) {
      console.warn('Fallback to memory store for delete experience:', e);
    }
    const len = memoryStore.experiences.length;
    memoryStore.experiences = memoryStore.experiences.filter((e) => e.id !== id);
    return memoryStore.experiences.length < len;
  },

  // EDUCATIONS
  async getEducations(): Promise<EducationData[]> {
    try {
      if (await isDbConnected()) {
        const list = await prisma.education.findMany({
          orderBy: [{ displayOrder: 'asc' }],
        });
        if (list && list.length > 0) return list as unknown as EducationData[];
      }
    } catch (e) {
      console.warn('Fallback to memory store for educations:', e);
    }
    return [...memoryStore.educations].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async createEducation(data: Partial<EducationData>): Promise<EducationData> {
    const newEdu: EducationData = {
      id: `edu-${Date.now()}`,
      institution: data.institution || 'University',
      degree: data.degree || 'Degree',
      field: data.field || 'Field of Study',
      startDate: data.startDate || '2020',
      endDate: data.endDate || '2024',
      isCurrent: data.isCurrent ?? false,
      description: data.description || '',
      grade: data.grade || '',
      displayOrder: data.displayOrder ?? memoryStore.educations.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    try {
      if (await isDbConnected()) {
        const created = await prisma.education.create({ data: newEdu as any });
        return created as unknown as EducationData;
      }
    } catch (e) {
      console.warn('Fallback to memory store for create education:', e);
    }

    memoryStore.educations.push(newEdu);
    return newEdu;
  },

  async updateEducation(id: string, data: Partial<EducationData>): Promise<EducationData | null> {
    try {
      if (await isDbConnected()) {
        const updated = await prisma.education.update({
          where: { id },
          data: { ...data, updatedAt: new Date() },
        });
        return updated as unknown as EducationData;
      }
    } catch (e) {
      console.warn('Fallback to memory store for update education:', e);
    }

    const idx = memoryStore.educations.findIndex((e) => e.id === id);
    if (idx !== -1) {
      memoryStore.educations[idx] = { ...memoryStore.educations[idx], ...data, updatedAt: new Date().toISOString() };
      return memoryStore.educations[idx];
    }
    return null;
  },

  async deleteEducation(id: string): Promise<boolean> {
    try {
      if (await isDbConnected()) {
        await prisma.education.delete({ where: { id } });
        return true;
      }
    } catch (e) {
      console.warn('Fallback to memory store for delete education:', e);
    }
    const len = memoryStore.educations.length;
    memoryStore.educations = memoryStore.educations.filter((e) => e.id !== id);
    return memoryStore.educations.length < len;
  },

  // CONTACT MESSAGES
  async getMessages(): Promise<ContactMessageData[]> {
    try {
      if (await isDbConnected()) {
        const list = await prisma.contactMessage.findMany({
          orderBy: [{ createdAt: 'desc' }],
        });
        return list as unknown as ContactMessageData[];
      }
    } catch (e) {
      console.warn('Fallback to memory store for messages:', e);
    }
    return [...memoryStore.messages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async createMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    ipHash?: string;
  }): Promise<ContactMessageData> {
    const newMsg: ContactMessageData = {
      id: `msg-${Date.now()}`,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      isRead: false,
      isArchived: false,
      ipHash: data.ipHash || null,
      createdAt: new Date().toISOString(),
    };

    try {
      if (await isDbConnected()) {
        const created = await prisma.contactMessage.create({ data: newMsg as any });
        return created as unknown as ContactMessageData;
      }
    } catch (e) {
      console.warn('Fallback to memory store for create message:', e);
    }

    memoryStore.messages.unshift(newMsg);
    return newMsg;
  },

  // SYNC LOGS
  async getSyncLogs(limit = 10): Promise<SyncLogData[]> {
    try {
      if (await isDbConnected()) {
        const list = await prisma.syncLog.findMany({
          take: limit,
          orderBy: [{ startedAt: 'desc' }],
        });
        return list as unknown as SyncLogData[];
      }
    } catch (e) {
      console.warn('Fallback to memory store for sync logs:', e);
    }
    return [...memoryStore.syncLogs].slice(0, limit);
  },

  async createSyncLog(data: Partial<SyncLogData>): Promise<SyncLogData> {
    const newLog: SyncLogData = {
      id: `sync-${Date.now()}`,
      triggerType: data.triggerType || 'MANUAL',
      status: data.status || 'SUCCESS',
      reposFound: data.reposFound || 0,
      reposNew: data.reposNew || 0,
      reposUpdated: data.reposUpdated || 0,
      reposUnchanged: data.reposUnchanged || 0,
      errorMessage: data.errorMessage || null,
      startedAt: data.startedAt || new Date().toISOString(),
      completedAt: data.completedAt || new Date().toISOString(),
    };

    try {
      if (await isDbConnected()) {
        const created = await prisma.syncLog.create({ data: newLog as any });
        return created as unknown as SyncLogData;
      }
    } catch (e) {
      console.warn('Fallback to memory store for create sync log:', e);
    }

    memoryStore.syncLogs.unshift(newLog);
    return newLog;
  },

  // SETTINGS
  async getSetting(key: string, defaultValue = ''): Promise<string> {
    try {
      if (await isDbConnected()) {
        const item = await prisma.setting.findUnique({ where: { key } });
        if (item) return item.value;
      }
    } catch (e) {
      console.warn('Fallback to memory store for setting:', e);
    }
    return memoryStore.settings[key] ?? defaultValue;
  },

  async setSetting(key: string, value: string, description?: string): Promise<void> {
    try {
      if (await isDbConnected()) {
        await prisma.setting.upsert({
          where: { key },
          update: { value, description, updatedAt: new Date() },
          create: { key, value, description },
        });
        return;
      }
    } catch (e) {
      console.warn('Fallback to memory store for set setting:', e);
    }
    memoryStore.settings[key] = value;
  },
};
