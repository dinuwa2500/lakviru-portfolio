'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer';
import { ProjectData } from '@/types';
import { cn } from '@/lib/utils';
import { TRANSITION_EASE } from '@/components/motion/motion-variants';

interface ProjectGridProps {
  initialProjects: ProjectData[];
  initialCategory?: string;
  initialTechnology?: string;
}

export function ProjectGrid({
  initialProjects,
  initialCategory = 'All',
  initialTechnology = '',
}: ProjectGridProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);
  const [selectedTech, setSelectedTech] = React.useState(initialTechnology);
  const [sortBy, setSortBy] = React.useState<'featured' | 'stars' | 'recent' | 'name'>('featured');

  // Categories extracted from projects
  const categories = ['All', 'Full-Stack', 'Backend', 'Frontend', 'Cloud/DevOps', 'Mobile'];

  // All unique technologies
  const allTechnologies = React.useMemo(() => {
    const techSet = new Set<string>();
    initialProjects.forEach((p) => {
      p.technologies?.forEach((t) => techSet.add(t));
      if (p.githubLanguage) techSet.add(p.githubLanguage);
    });
    return Array.from(techSet).sort();
  }, [initialProjects]);

  // Filtered & Sorted projects
  const filteredProjects = React.useMemo(() => {
    return initialProjects
      .filter((project) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const title = (project.customTitle || project.githubName || '').toLowerCase();
          const desc = (project.customDescription || project.githubDescription || '').toLowerCase();
          const techMatches = project.technologies?.some((t) => t.toLowerCase().includes(q));
          const topicMatches = project.githubTopics?.some((t) => t.toLowerCase().includes(q));
          if (!title.includes(q) && !desc.includes(q) && !techMatches && !topicMatches) {
            return false;
          }
        }

        // Category
        if (selectedCategory !== 'All') {
          if (project.category.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        // Technology
        if (selectedTech) {
          const hasTech =
            project.technologies?.includes(selectedTech) ||
            project.githubLanguage === selectedTech ||
            project.githubLanguages?.includes(selectedTech);
          if (!hasTech) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
          if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
          return (b.githubStars || 0) - (a.githubStars || 0);
        }
        if (sortBy === 'stars') {
          return (b.githubStars || 0) - (a.githubStars || 0);
        }
        if (sortBy === 'recent') {
          const dateA = new Date(a.githubUpdatedAt || a.updatedAt || 0).getTime();
          const dateB = new Date(b.githubUpdatedAt || b.updatedAt || 0).getTime();
          return dateB - dateA;
        }
        if (sortBy === 'name') {
          const titleA = a.customTitle || a.githubName || '';
          const titleB = b.customTitle || b.githubName || '';
          return titleA.localeCompare(titleB);
        }
        return 0;
      });
  }, [initialProjects, searchQuery, selectedCategory, selectedTech, sortBy]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || selectedTech !== '';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTech('');
    setSortBy('featured');
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search projects by title, tech stack, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Tech dropdown filter */}
          <div className="relative">
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="h-10 px-3 pr-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-sm"
            >
              <option value="">All Technologies</option>
              {allTechnologies.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2.5 h-10 shadow-sm">
            <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="stars">Most GitHub Stars</option>
              <option value="recent">Recently Updated</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="h-10 px-3 rounded-xl border border-rose-500/20 text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs with Animated Indicator */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'relative px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer',
                isSelected
                  ? 'text-white dark:text-zinc-900 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              )}
            >
              {isSelected && (
                <motion.span
                  layoutId="activeCategoryPill"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute inset-0 bg-zinc-900 dark:bg-zinc-100 rounded-xl -z-0 shadow-sm"
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono">
        <span>Showing {filteredProjects.length} of {initialProjects.length} projects</span>
        {selectedCategory !== 'All' && <span>Category: {selectedCategory}</span>}
      </div>

      {/* Project Grid with Staggered Entrance */}
      {filteredProjects.length > 0 ? (
        <StaggerContainer
          key={`${selectedCategory}-${selectedTech}-${sortBy}-${searchQuery}`}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filteredProjects.map((project) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center space-y-4"
        >
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
            <Filter className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              No projects found
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              We couldn&apos;t find any projects matching your current filter criteria.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Reset all filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
