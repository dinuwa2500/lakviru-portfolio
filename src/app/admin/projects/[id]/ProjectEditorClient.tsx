'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  ExternalLink,
  Star,
  GitFork,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Archive,
  Trash2,
  Layers,
  Image as ImageIcon,
  Workflow,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { Github } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { updateProjectAction, deleteProjectAction, archiveProjectAction } from '@/actions/projects';
import { ProjectData } from '@/types';
import { formatDateTime, formatDate, slugify } from '@/lib/utils';

interface ProjectEditorClientProps {
  project: ProjectData;
}

export function ProjectEditorClient({ project: initialProject }: ProjectEditorClientProps) {
  const router = useRouter();
  const [project, setProject] = React.useState<ProjectData>(initialProject);
  const [isSaving, setIsSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [slug, setSlug] = React.useState(project.slug);
  const [customTitle, setCustomTitle] = React.useState(project.customTitle || project.githubName || '');
  const [customDesc, setCustomDesc] = React.useState(project.customDescription || project.githubDescription || '');
  const [category, setCategory] = React.useState(project.category || 'Full-Stack');
  const [status, setStatus] = React.useState(project.status || 'PUBLISHED');
  const [isFeatured, setIsFeatured] = React.useState(project.isFeatured);
  const [isVisible, setIsVisible] = React.useState(project.isVisible);
  const [displayOrder, setDisplayOrder] = React.useState(project.displayOrder || 1);
  const [thumbnail, setThumbnail] = React.useState(project.thumbnail || '');
  const [demoUrl, setDemoUrl] = React.useState(project.demoUrl || '');
  const [problem, setProblem] = React.useState(project.problem || '');
  const [solution, setSolution] = React.useState(project.solution || '');
  const [myRole, setMyRole] = React.useState(project.myRole || '');
  const [architecture, setArchitecture] = React.useState(project.architecture || '');
  const [technologiesText, setTechnologiesText] = React.useState(
    (project.technologies || []).join(', ')
  );
  const [featuresText, setFeaturesText] = React.useState(
    (project.features || []).join('\n')
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    const techArray = technologiesText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const featArray = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      const res = await updateProjectAction(project.id, {
        slug: slugify(slug),
        customTitle,
        customDescription: customDesc,
        category,
        status: status as any,
        isFeatured,
        isVisible,
        displayOrder: Number(displayOrder),
        thumbnail: thumbnail || null,
        demoUrl: demoUrl || null,
        problem: problem || null,
        solution: solution || null,
        myRole: myRole || null,
        architecture: architecture || null,
        technologies: techArray,
        features: featArray,
      });

      if (res.success && res.project) {
        setProject(res.project);
        setFeedback({ type: 'success', message: 'Project case study updated and saved successfully!' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update project' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to update project' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm('Archive this project? It will be hidden from the public portfolio.')) return;
    await archiveProjectAction(project.id);
    setStatus('ARCHIVED');
    setIsVisible(false);
    setIsFeatured(false);
    setFeedback({ type: 'success', message: 'Project marked as archived' });
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this project?')) return;
    await deleteProjectAction(project.id);
    router.push('/admin/projects');
    router.refresh();
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {customTitle || project.githubName}
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              Slug: /projects/{slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/projects/${project.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Preview Public</span>
          </Link>

          <Button type="submit" variant="primary" size="sm" isLoading={isSaving} className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 1. GitHub Controlled Metrics (Read-only / Non-destructive) */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2 font-bold text-sm text-zinc-900 dark:text-zinc-100">
            <Github className="h-4 w-4 text-indigo-500" />
            <span>GitHub Synchronized Metrics</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Protected from accidental overwrites
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="space-y-1 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
            <div className="text-zinc-500">Repository Name</div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {project.githubName || 'Custom Project'}
            </div>
          </div>

          <div className="space-y-1 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
            <div className="text-zinc-500">Stars / Forks</div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="h-3 w-3 fill-current" />
                {project.githubStars}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-purple-500">
                <GitFork className="h-3 w-3" />
                {project.githubForks}
              </span>
            </div>
          </div>

          <div className="space-y-1 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
            <div className="text-zinc-500">Primary Language</div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100">
              {project.githubLanguage || 'Not specified'}
            </div>
          </div>

          <div className="space-y-1 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
            <div className="text-zinc-500">Last Synced</div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {formatDateTime(project.lastSyncedAt)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Portfolio Case Study Customization */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 space-y-6">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          Portfolio Overrides & Content
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Custom Display Title"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            required
          />

          <Input
            label="URL Slug (/projects/[slug])"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <Textarea
          label="Custom Overview / Description"
          value={customDesc}
          onChange={(e) => setCustomDesc(e.target.value)}
          rows={3}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="Full-Stack">Full-Stack</option>
              <option value="Backend">Backend</option>
              <option value="Frontend">Frontend</option>
              <option value="Cloud/DevOps">Cloud/DevOps</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Status State
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as any);
                if (e.target.value === 'FEATURED') setIsFeatured(true);
                if (e.target.value === 'HIDDEN') setIsVisible(false);
                if (e.target.value === 'PUBLISHED') setIsVisible(true);
              }}
              className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="PUBLISHED">Published</option>
              <option value="FEATURED">Featured</option>
              <option value="HIDDEN">Hidden</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <Input
            label="Display Order (Sort weight)"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Technologies (comma separated)"
            value={technologiesText}
            onChange={(e) => setTechnologiesText(e.target.value)}
            placeholder="TypeScript, PostgreSQL, Next.js, Docker"
          />

          <Input
            label="Live Demo URL"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <Input
          label="Thumbnail Image URL"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          placeholder="https://images.unsplash.com/..."
        />
      </div>

      {/* 3. Deep Engineering Case Study Fields */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 space-y-6">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          Engineering Case Study Deep-Dive
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Textarea
            label="The Problem Solved"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={4}
            placeholder="What bottleneck, scalability issue, or architectural limitation was solved?"
          />

          <Textarea
            label="The Solution & Technical Design"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            rows={4}
            placeholder="How was the system architected to solve the problem?"
          />
        </div>

        <Textarea
          label="My Role & Contributions"
          value={myRole}
          onChange={(e) => setMyRole(e.target.value)}
          rows={3}
          placeholder="e.g. Lead Developer — Implemented WebSocket cluster rooms and benchmarked performance..."
        />

        <Textarea
          label="Architecture Flow / Diagram Summary"
          value={architecture}
          onChange={(e) => setArchitecture(e.target.value)}
          rows={2}
          placeholder="e.g. Client UI → WebSocket Gateway → Raft Broker → Append-only Commit Log"
        />

        <Textarea
          label="Key Features List (1 feature per line)"
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          rows={4}
          placeholder="Append-only disk-backed segment storage&#10;Dynamic partition rebalancing&#10;Sub-millisecond P99 latency"
        />
      </div>

      {/* 4. Publishing Switches & Danger Zone */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Visible to Public</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Featured on Homepage</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleArchive}
            className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Archive
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-3 py-2 rounded-lg border border-rose-500/20 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </form>
  );
}
