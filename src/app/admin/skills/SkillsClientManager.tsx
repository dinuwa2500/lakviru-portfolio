'use client';

import * as React from 'react';
import { Plus, Edit, Trash2, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { createSkillAction, updateSkillAction, deleteSkillAction } from '@/actions/skills';
import { SkillData, SkillCategory } from '@/types';

interface SkillsClientManagerProps {
  initialSkills: SkillData[];
}

export function SkillsClientManager({ initialSkills }: SkillsClientManagerProps) {
  const [skills, setSkills] = React.useState<SkillData[]>(initialSkills);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingSkill, setEditingSkill] = React.useState<SkillData | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  // Form states
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState<SkillCategory>('LANGUAGES');
  const [skillLevel, setSkillLevel] = React.useState(85);
  const [description, setDescription] = React.useState('');
  const [displayOrder, setDisplayOrder] = React.useState(1);
  const [isFeatured, setIsFeatured] = React.useState(false);

  const openAddModal = () => {
    setEditingSkill(null);
    setName('');
    setCategory('LANGUAGES');
    setSkillLevel(85);
    setDescription('');
    setDisplayOrder(skills.length + 1);
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (skill: SkillData) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category);
    setSkillLevel(skill.skillLevel || 80);
    setDescription(skill.description || '');
    setDisplayOrder(skill.displayOrder || 1);
    setIsFeatured(skill.isFeatured || false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      if (editingSkill) {
        const res = await updateSkillAction(editingSkill.id, {
          name,
          category,
          skillLevel: Number(skillLevel),
          description,
          displayOrder: Number(displayOrder),
          isFeatured,
        });
        if (res.success && res.skill) {
          setSkills((prev) => prev.map((s) => (s.id === editingSkill.id ? res.skill! : s)));
          setFeedback('Skill updated successfully!');
        }
      } else {
        const res = await createSkillAction({
          name,
          category,
          skillLevel: Number(skillLevel),
          description,
          displayOrder: Number(displayOrder),
          isFeatured,
        });
        if (res.success && res.skill) {
          setSkills((prev) => [...prev, res.skill!]);
          setFeedback('Skill added successfully!');
        }
      }
      setIsModalOpen(false);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Action failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    setSkills((prev) => prev.filter((s) => s.id !== id));
    await deleteSkillAction(id);
    setFeedback('Skill removed');
    setTimeout(() => setFeedback(null), 3000);
  };

  const categories: SkillCategory[] = [
    'LANGUAGES',
    'FRONTEND',
    'BACKEND',
    'DATABASES',
    'DEVOPS_CLOUD',
    'TOOLS',
  ];

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Skills & Capabilities ({skills.length})
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Add, reorder, and categorize engineering competencies
          </p>
        </div>
        <Button onClick={openAddModal} variant="primary" size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </Button>
      </div>

      {/* Categorized Skills Panels */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const groupSkills = skills.filter((s) => s.category === cat);
          if (groupSkills.length === 0) return null;

          return (
            <div
              key={cat}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-mono">
                  {cat.replace('_', ' ')} ({groupSkills.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 space-y-2 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          {skill.name}
                        </div>
                        {skill.description && (
                          <div className="text-xs text-zinc-500 line-clamp-2 mt-1">
                            {skill.description}
                          </div>
                        )}
                      </div>
                      {skill.isFeatured && (
                        <Badge variant="purple" className="shrink-0 text-[10px]">
                          Featured
                        </Badge>
                      )}
                    </div>

                    <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
                      <span>Level: {skill.skillLevel}%</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(skill)}
                          className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-rose-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Skill Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. TypeScript, Docker, PostgreSQL"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SkillCategory)}
                className="w-full h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Proficiency % (1-100)"
              type="number"
              min={1}
              max={100}
              value={skillLevel}
              onChange={(e) => setSkillLevel(Number(e.target.value))}
            />
          </div>

          <Textarea
            label="Short Description / Sub-topics"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="e.g. Advanced generics, compiler API, and microservices"
          />

          <div className="flex items-center justify-between pt-2">
            <Input
              label="Display Order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="max-w-[120px]"
            />

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-5">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-indigo-600"
              />
              <span>Primary / Highlight</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
            >
              {editingSkill ? 'Save Changes' : 'Add Skill'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
