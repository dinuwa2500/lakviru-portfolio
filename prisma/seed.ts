import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  INITIAL_PROFILE,
  INITIAL_PROJECTS,
  INITIAL_SKILLS,
  INITIAL_EXPERIENCES,
  INITIAL_EDUCATIONS,
} from '../src/lib/seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with verified portfolio data...');

  // 1. Seed Admin User
  const adminEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'dinuwaperera123@gmail.com').toLowerCase();
  const rawPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@2026!';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(rawPassword, salt);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: 'Lakviru Perera' },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Lakviru Perera',
      role: 'ADMIN',
    },
  });
  console.log('✓ Admin user initialized');

  // 2. Seed Profile
  const existingProfile = await prisma.profile.findFirst();
  if (!existingProfile) {
    await prisma.profile.create({
      data: { ...INITIAL_PROFILE },
    });
    console.log('✓ Profile initialized');
  }

  // 3. Seed Projects
  for (const project of INITIAL_PROJECTS) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: {
        slug: project.slug,
        githubRepoId: project.githubRepoId,
        githubName: project.githubName,
        githubFullName: project.githubFullName,
        githubUrl: project.githubUrl,
        githubDescription: project.githubDescription,
        githubStars: project.githubStars,
        githubForks: project.githubForks,
        githubLanguage: project.githubLanguage,
        githubLanguages: JSON.stringify(project.githubLanguages || []),
        githubTopics: JSON.stringify(project.githubTopics || []),
        customTitle: project.customTitle,
        customDescription: project.customDescription,
        category: project.category,
        status: project.status,
        isFeatured: project.isFeatured,
        isVisible: project.isVisible,
        displayOrder: project.displayOrder,
        thumbnail: project.thumbnail,
        screenshots: JSON.stringify(project.screenshots || []),
        problem: project.problem,
        solution: project.solution,
        myRole: project.myRole,
        features: JSON.stringify(project.features || []),
        demoUrl: project.demoUrl,
        architecture: project.architecture,
        technologies: JSON.stringify(project.technologies || []),
      },
    });
  }
  console.log(`✓ ${INITIAL_PROJECTS.length} Projects initialized`);

  // 4. Seed Skills
  for (const skill of INITIAL_SKILLS) {
    const existing = await prisma.skill.findFirst({
      where: { name: skill.name, category: skill.category },
    });
    if (!existing) {
      await prisma.skill.create({
        data: {
          name: skill.name,
          category: skill.category,
          skillLevel: skill.skillLevel,
          icon: skill.icon,
          description: skill.description,
          displayOrder: skill.displayOrder,
          isFeatured: skill.isFeatured,
        },
      });
    }
  }
  console.log(`✓ ${INITIAL_SKILLS.length} Skills initialized`);

  // 5. Seed Experience (VVH Solutions)
  for (const exp of INITIAL_EXPERIENCES) {
    const existing = await prisma.experience.findFirst({
      where: { company: exp.company, position: exp.position },
    });
    if (!existing) {
      await prisma.experience.create({
        data: {
          company: exp.company,
          position: exp.position,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate,
          isCurrent: exp.isCurrent,
          description: exp.description,
          responsibilities: JSON.stringify(exp.responsibilities || []),
          achievements: JSON.stringify(exp.achievements || []),
          technologies: JSON.stringify(exp.technologies || []),
          displayOrder: exp.displayOrder,
        },
      });
    }
  }
  console.log(`✓ Experience initialized`);

  // 6. Seed Education (SLIIT)
  for (const edu of INITIAL_EDUCATIONS) {
    const existing = await prisma.education.findFirst({
      where: { institution: edu.institution, degree: edu.degree },
    });
    if (!existing) {
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
  console.log(`✓ Education initialized`);

  console.log('✨ Seeding successfully completed.');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
