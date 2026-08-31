import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  Star,
  GitFork,
  Calendar,
  Cpu,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  User,
  Workflow,
  Sparkles,
} from 'lucide-react';
import { Github } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FadeIn } from '@/components/motion/FadeIn';
import { dbService } from '@/lib/db';
import { formatDate, getLanguageColor } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await dbService.getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const title = project.customTitle || project.githubName || 'Engineering Project';
  const description = project.customDescription || project.githubDescription || '';

  return {
    title: `${title} | Case Study`,
    description,
    openGraph: {
      title: `${title} - Engineering Case Study`,
      description,
      type: 'article',
      images: project.thumbnail ? [{ url: project.thumbnail }] : [],
    },
  };
}

export const revalidate = 60;

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await dbService.getProjectBySlug(slug);

  if (!project || (!project.isVisible && project.status === 'HIDDEN')) {
    notFound();
  }

  const title = project.customTitle || project.githubName || 'Project Case Study';
  const description = project.customDescription || project.githubDescription || '';
  const primaryLang = project.githubLanguage || (project.technologies && project.technologies[0]) || 'TypeScript';
  const langColor = getLanguageColor(primaryLang);

  return (
    <article className="pt-28 sm:pt-36 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Back Link */}
      <FadeIn direction="left">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects</span>
        </Link>
      </FadeIn>

      {/* Hero Header */}
      <FadeIn direction="up" delay={0.05} className="space-y-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="primary" className="font-mono text-xs">
            {project.category}
          </Badge>
          {project.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-600 text-white">
              <Sparkles className="h-3 w-3 fill-current" />
              Featured Case Study
            </span>
          )}
          <span className="text-xs text-zinc-500 font-mono">
            Updated {formatDate(project.githubUpdatedAt || project.updatedAt)}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15]">
          {title}
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              <Button size="md" variant="primary" className="gap-2 shadow-md shadow-indigo-500/20">
                <span>View Live Demo</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          )}

          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button size="md" variant="secondary" className="gap-2">
                <Github className="h-4 w-4" />
                <span>Source Code</span>
              </Button>
            </a>
          )}
        </div>
      </FadeIn>

      {/* Hero Image / Banner */}
      {project.thumbnail && (
        <FadeIn direction="up" delay={0.1}>
          <div className="rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl bg-zinc-950">
            <img
              src={project.thumbnail}
              alt={title}
              className="w-full max-h-[460px] object-cover object-center"
            />
          </div>
        </FadeIn>
      )}

      {/* GitHub Repository Metrics Box */}
      <FadeIn direction="up" delay={0.12}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-md">
          <div className="space-y-1">
            <div className="text-xs text-zinc-500 font-mono">Primary Language</div>
            <div className="flex items-center gap-2 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: langColor }} />
              <span>{primaryLang}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-zinc-500 font-mono">GitHub Stars</div>
            <div className="flex items-center gap-1.5 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500/30" />
              <span>{project.githubStars}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-zinc-500 font-mono">GitHub Forks</div>
            <div className="flex items-center gap-1.5 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              <GitFork className="h-4 w-4 text-purple-500" />
              <span>{project.githubForks}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-zinc-500 font-mono">Created</div>
            <div className="flex items-center gap-1.5 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              <Calendar className="h-4 w-4 text-zinc-400" />
              <span>{formatDate(project.githubCreatedAt || project.createdAt)}</span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Tech Stack Pills */}
      {project.technologies && project.technologies.length > 0 && (
        <FadeIn direction="up" delay={0.14} className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
            Technology Stack & Tools
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-xl text-xs font-mono font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60"
              >
                {tech}
              </span>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Problem & Solution Case Study Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {project.problem && (
          <FadeIn direction="up" delay={0.16}>
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 sm:p-8 space-y-3 shadow-md h-full">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm font-mono">
                <HelpCircle className="h-4 w-4" />
                <span>The Engineering Problem</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {project.problem}
              </p>
            </div>
          </FadeIn>
        )}

        {project.solution && (
          <FadeIn direction="up" delay={0.18}>
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 sm:p-8 space-y-3 shadow-md h-full">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm font-mono">
                <Lightbulb className="h-4 w-4" />
                <span>The Architecture & Solution</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </FadeIn>
        )}
      </div>

      {/* Key Architectural Features */}
      {project.features && project.features.length > 0 && (
        <FadeIn direction="up" delay={0.2}>
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 sm:p-8 space-y-4 shadow-md">
            <div className="flex items-center gap-2 font-bold text-base text-zinc-900 dark:text-zinc-100">
              <Workflow className="h-5 w-5 text-indigo-500" />
              <span>Key Engineering Highlights & Capabilities</span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {project.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  <CheckCircle className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      )}

      {/* Architecture Flow */}
      {project.architecture && (
        <FadeIn direction="up" delay={0.22}>
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-950 p-6 sm:p-8 space-y-3 font-mono text-xs text-zinc-300 shadow-xl">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Cpu className="h-4 w-4" />
              <span>Data Flow & Component Architecture</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 overflow-x-auto text-zinc-200">
              {project.architecture}
            </div>
          </div>
        </FadeIn>
      )}

      {/* My Contribution / Role */}
      {project.myRole && (
        <FadeIn direction="up" delay={0.24}>
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 sm:p-8 space-y-3 shadow-md">
            <div className="flex items-center gap-2 font-bold text-sm font-mono text-zinc-900 dark:text-zinc-100">
              <User className="h-4 w-4 text-indigo-500" />
              <span>My Contribution & Engineering Role</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {project.myRole}
            </p>
          </div>
        </FadeIn>
      )}

      {/* Screenshots Gallery */}
      {project.screenshots && project.screenshots.length > 1 && (
        <FadeIn direction="up" delay={0.26} className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            System Gallery & Previews
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.screenshots.map((shot, idx) => (
              <div
                key={idx}
                className="rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 shadow-md bg-zinc-950"
              >
                <img
                  src={shot}
                  alt={`${title} Preview ${idx + 1}`}
                  className="w-full h-56 object-cover object-center hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </FadeIn>
      )}
    </article>
  );
}
