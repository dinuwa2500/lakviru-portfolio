'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Star,
  Eye,
  EyeOff,
  Sparkles,
  Archive,
  ExternalLink,
  Edit,
  Trash2,
  Filter,
  CheckCircle2,
  FolderGit2,
} from 'lucide-react';
import { Github } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  toggleProjectVisibilityAction,
  toggleProjectFeaturedAction,
  archiveProjectAction,
  deleteProjectAction,
  createProjectAction,
} from '@/actions/projects';
import { ProjectData, ProjectStatus } from '@/types';
import { formatDate, formatDateTime, slugify } from '@/lib/utils';

interface ProjectsClientTableProps {
  initialProjects: ProjectData[];
}

export function ProjectsClientTable({ initialProjects }: ProjectsClientTableProps) {
  const [projects, setProjects] = React.useState<ProjectData[]>(initialProjects);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);

  // Form state for creating project
  const [newTitle, setNewTitle] = React.useState('');
  const [newDesc, setNewDesc] = React.useState('');
  const [newCategory, setNewCategory] = React.useState('Full-Stack');
  const [newTech, setNewTech] = React.useState('TypeScript, Next.js, PostgreSQL');
  const [newDemoUrl, setNewDemoUrl] = React.useState('');
  const [newGithubUrl, setNewGithubUrl] = React.useState('');

  React.useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const handleToggleVisibility = async (id: string, currentVal: boolean) => {
    const nextVal = !currentVal;
    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isVisible: nextVal, status: nextVal ? 'PUBLISHED' : 'HIDDEN' } : p))
    );
    await toggleProjectVisibilityAction(id, nextVal);
  };

  const handleToggleFeatured = async (id: string, currentVal: boolean) => {
    const nextVal = !currentVal;
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: nextVal, status: nextVal ? 'FEATURED' : 'PUBLISHED' } : p))
    );
    await toggleProjectFeaturedAction(id, nextVal);
  };

  const handleArchive = async (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'ARCHIVED', isVisible: false, isFeatured: false } : p))
    );
    await archiveProjectAction(id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await deleteProjectAction(id);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const generatedSlug = slugify(newTitle);
      const technologiesList = newTech
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await createProjectAction({
        slug: generatedSlug,
        customTitle: newTitle,
        customDescription: newDesc,
        category: newCategory,
        technologies: technologiesList,
        demoUrl: newDemoUrl || null,
        githubUrl: newGithubUrl || null,
        status: 'PUBLISHED',
        isVisible: true,
        isFeatured: false,
      });

      if (res.success && res.project) {
        setProjects((prev) => [res.project!, ...prev]);
        setIsAddModalOpen(false);
        setFeedbackMsg('Project created successfully!');
        setTimeout(() => setFeedbackMsg(null), 3000);
        // Reset form
        setNewTitle('');
        setNewDesc('');
        setNewDemoUrl('');
        setNewGithubUrl('');
      } else {
        alert(res.error || 'Failed to create project');
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = (project.customTitle || project.githubName || '').toLowerCase();
      const desc = (project.customDescription || project.githubDescription || '').toLowerCase();
      const lang = (project.githubLanguage || '').toLowerCase();
      if (!title.includes(q) && !desc.includes(q) && !lang.includes(q)) {
        return false;
      }
    }

    // Status filter
    if (statusFilter === 'PUBLISHED') return project.status === 'PUBLISHED' || (project.isVisible && project.status !== 'HIDDEN' && project.status !== 'ARCHIVED');
    if (statusFilter === 'FEATURED') return project.isFeatured;
    if (statusFilter === 'HIDDEN') return project.status === 'HIDDEN' || !project.isVisible;
    if (statusFilter === 'ARCHIVED') return project.status === 'ARCHIVED';

    return true;
  });

  return (
    <div className="space-y-6">
      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="primary"
          size="sm"
          className="gap-1.5 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Project</span>
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        {['ALL', 'PUBLISHED', 'FEATURED', 'HIDDEN', 'ARCHIVED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
              statusFilter === st
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            {st} ({st === 'ALL' ? projects.length : projects.filter((p) => {
              if (st === 'PUBLISHED') return p.status === 'PUBLISHED' || (p.isVisible && p.status !== 'HIDDEN' && p.status !== 'ARCHIVED');
              if (st === 'FEATURED') return p.isFeatured;
              if (st === 'HIDDEN') return p.status === 'HIDDEN' || !p.isVisible;
              if (st === 'ARCHIVED') return p.status === 'ARCHIVED';
              return true;
            }).length})
          </button>
        ))}
      </div>

      {/* Projects Data Table */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-mono bg-zinc-50/50 dark:bg-zinc-900/50">
                <th className="p-4 font-medium">Project</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Language</th>
                <th className="p-4 font-medium">Stars</th>
                <th className="p-4 font-medium">Visibility</th>
                <th className="p-4 font-medium">Featured</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="p-4">
                      <div className="space-y-0.5 max-w-xs sm:max-w-sm">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                          <Link
                            href={`/admin/projects/${project.id}`}
                            className="hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
                          >
                            {project.customTitle || project.githubName}
                          </Link>
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="GitHub Link"
                              className="text-zinc-400 hover:text-zinc-600 shrink-0"
                            >
                              <Github className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono truncate">
                          /{project.slug}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <Badge variant="outline" className="text-[11px]">
                        {project.category}
                      </Badge>
                    </td>

                    <td className="p-4 font-mono text-[11px]">
                      {project.githubLanguage || (project.technologies && project.technologies[0]) || '—'}
                    </td>

                    <td className="p-4 font-mono">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500/30" />
                        <span>{project.githubStars}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleVisibility(project.id, project.isVisible)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                          project.isVisible
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 border border-zinc-300 dark:border-zinc-700'
                        }`}
                      >
                        {project.isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        <span>{project.isVisible ? 'Visible' : 'Hidden'}</span>
                      </button>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleFeatured(project.id, project.isFeatured)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                          project.isFeatured
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                            : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-400 border border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>{project.isFeatured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                          title="Edit Case Study"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Link>

                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                          title="Preview Public Page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>

                        <button
                          onClick={() => handleArchive(project.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          title="Archive Project"
                        >
                          <Archive className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-400">
                    No projects found for current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom Project Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Custom Engineering Project"
        description="Create a custom portfolio case study or manually track an unlisted repository"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Project Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Distributed Consensus Engine"
            required
          />

          <Textarea
            label="Custom Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="High-throughput distributed consensus algorithm implementation..."
            rows={3}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                <option value="Full-Stack">Full-Stack</option>
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="Cloud/DevOps">Cloud/DevOps</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>

            <Input
              label="Technologies (comma separated)"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="TypeScript, Docker, Go"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="GitHub URL (Optional)"
              value={newGithubUrl}
              onChange={(e) => setNewGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
            />

            <Input
              label="Live Demo URL (Optional)"
              value={newDemoUrl}
              onChange={(e) => setNewDemoUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
