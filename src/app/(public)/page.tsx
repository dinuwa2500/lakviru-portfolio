import Link from 'next/link';
import { ArrowRight, Sparkles, Terminal, Server, Code, ShieldCheck } from 'lucide-react';
import { HeroSection } from '@/components/hero/HeroSection';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { SkillsSection } from '@/components/skills/SkillsSection';
import { ExperienceTimeline } from '@/components/experience/ExperienceTimeline';
import { EducationSection } from '@/components/education/EducationSection';
import { GitHubActivity } from '@/components/github/GitHubActivity';
import { ContactForm } from '@/components/contact/ContactForm';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer';
import { dbService } from '@/lib/db';
import { fetchGitHubUserStats, getTargetGitHubUsername } from '@/lib/github';

export default async function HomePage() {
  const [profile, projects, skills, experiences, educations, githubUsername] = await Promise.all([
    dbService.getProfile(),
    dbService.getProjects({ featuredOnly: true }),
    dbService.getSkills(),
    dbService.getExperiences(),
    dbService.getEducations(),
    getTargetGitHubUsername(),
  ]);

  const githubStats = await fetchGitHubUserStats(githubUsername);

  // Select the top featured project for the Hero Engineering Visual (lowest displayOrder)
  const topFeaturedProject = projects && projects.length > 0 ? projects[0] : null;

  // If no featured projects exist, fallback to first 3 published projects for the grid
  const displayFeatured =
    projects.length > 0
      ? projects
      : (await dbService.getProjects({ includeHidden: false })).slice(0, 3);

  return (
    <div className="space-y-12 sm:space-y-20">
      {/* 1. HERO */}
      <HeroSection profile={profile} featuredProject={topFeaturedProject} />

      {/* 2. FEATURED PROJECTS */}
      <section className="py-12 sm:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <FadeIn direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Featured Engineering Work</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Architectural Highlights & Case Studies
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
                  Selected production systems, distributed infrastructure, and full-stack platforms engineered with high performance and reliability in mind.
                </p>
              </div>

              <Link href="/projects" className="shrink-0">
                <Button variant="outline" size="sm" className="gap-2 group">
                  <span>View All Projects</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayFeatured.map((project) => (
              <StaggerItem key={project.id}>
                <ProjectCard project={project} isPriority />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 3. SKILLS MATRIX */}
      <SkillsSection skills={skills} />

      {/* 4. ABOUT & ENGINEERING PHILOSOPHY */}
      <section className="py-16 sm:py-20 relative bg-zinc-100/50 dark:bg-zinc-900/30 border-y border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <FadeIn direction="up" className="max-w-3xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Terminal className="h-3.5 w-3.5" />
              <span>Engineering Philosophy</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              How I Approach Software Systems
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {profile.bio}
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <StaggerItem>
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 space-y-3 h-full hover:border-indigo-500/40 transition-colors shadow-md">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Server className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Resilient Distributed Backend
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Designing event-driven microservices, transaction boundaries, connection pooling, and sub-millisecond caching layers for mission-critical reliability.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 space-y-3 h-full hover:border-purple-500/40 transition-colors shadow-md">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <Code className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Clean, Maintainable Code
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Applying domain-driven design, TypeScript strict safety, automated testing, and modular separation of concerns that accelerate long-term team velocity.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 space-y-3 h-full hover:border-emerald-500/40 transition-colors shadow-md">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Cloud-Native & DevOps Ready
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Containerization with Docker, automated CI/CD pipelines with GitHub Actions, structured telemetry monitoring, and zero-downtime rolling updates.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 5. EXPERIENCE TIMELINE */}
      <ExperienceTimeline experiences={experiences} />

      {/* 6. EDUCATION */}
      <EducationSection educations={educations} />

      {/* 7. GITHUB LIVE STATS */}
      <GitHubActivity stats={githubStats} githubUsername={githubUsername} />

      {/* 8. CONTACT */}
      <ContactForm profile={profile} />
    </div>
  );
}
