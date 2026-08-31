'use client';

import * as React from 'react';
import { Plus, Edit, Trash2, CheckCircle2, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { createExperienceAction, updateExperienceAction, deleteExperienceAction } from '@/actions/experience';
import { ExperienceData } from '@/types';
import { formatDate } from '@/lib/utils';

interface ExperienceClientManagerProps {
  initialExperiences: ExperienceData[];
}

export function ExperienceClientManager({ initialExperiences }: ExperienceClientManagerProps) {
  const [experiences, setExperiences] = React.useState<ExperienceData[]>(initialExperiences);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingExp, setEditingExp] = React.useState<ExperienceData | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  // Form state
  const [company, setCompany] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [isCurrent, setIsCurrent] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [responsibilitiesText, setResponsibilitiesText] = React.useState('');
  const [achievementsText, setAchievementsText] = React.useState('');
  const [technologiesText, setTechnologiesText] = React.useState('');
  const [displayOrder, setDisplayOrder] = React.useState(1);

  const openAddModal = () => {
    setEditingExp(null);
    setCompany('');
    setPosition('');
    setLocation('');
    setStartDate('2024-01');
    setEndDate('');
    setIsCurrent(false);
    setDescription('');
    setResponsibilitiesText('');
    setAchievementsText('');
    setTechnologiesText('TypeScript, Next.js, PostgreSQL');
    setDisplayOrder(experiences.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (exp: ExperienceData) => {
    setEditingExp(exp);
    setCompany(exp.company);
    setPosition(exp.position);
    setLocation(exp.location || '');
    setStartDate(exp.startDate);
    setEndDate(exp.endDate || '');
    setIsCurrent(exp.isCurrent || false);
    setDescription(exp.description);
    setResponsibilitiesText((exp.responsibilities || []).join('\n'));
    setAchievementsText((exp.achievements || []).join('\n'));
    setTechnologiesText((exp.technologies || []).join(', '));
    setDisplayOrder(exp.displayOrder || 1);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim()) return;

    setIsSaving(true);
    const respArray = responsibilitiesText
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);
    const achArray = achievementsText
      .split('\n')
      .map((a) => a.trim())
      .filter(Boolean);
    const techArray = technologiesText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingExp) {
        const res = await updateExperienceAction(editingExp.id, {
          company,
          position,
          location: location || null,
          startDate,
          endDate: isCurrent ? null : endDate || null,
          isCurrent,
          description,
          responsibilities: respArray,
          achievements: achArray,
          technologies: techArray,
          displayOrder: Number(displayOrder),
        });
        if (res.success && res.experience) {
          setExperiences((prev) => prev.map((e) => (e.id === editingExp.id ? res.experience! : e)));
          setFeedback('Experience updated successfully!');
        }
      } else {
        const res = await createExperienceAction({
          company,
          position,
          location: location || null,
          startDate,
          endDate: isCurrent ? null : endDate || null,
          isCurrent,
          description,
          responsibilities: respArray,
          achievements: achArray,
          technologies: techArray,
          displayOrder: Number(displayOrder),
        });
        if (res.success && res.experience) {
          setExperiences((prev) => [...prev, res.experience!]);
          setFeedback('Experience added successfully!');
        }
      }
      setIsModalOpen(false);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Failed to save experience');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience entry?')) return;
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    await deleteExperienceAction(id);
    setFeedback('Experience removed');
    setTimeout(() => setFeedback(null), 3000);
  };

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
            Work Experience Timeline ({experiences.length})
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Manage your employment history, roles, achievements, and tech stack tags
          </p>
        </div>
        <Button onClick={openAddModal} variant="primary" size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span>Add Position</span>
        </Button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 space-y-3 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {exp.position} &mdash; <span className="text-indigo-600 dark:text-indigo-400">{exp.company}</span>
                </h3>
                <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(exp.startDate)} &mdash; {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {exp.location}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="secondary" onClick={() => openEditModal(exp)} className="p-1.5">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {exp.responsibilities && exp.responsibilities.length > 0 && (
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1 list-disc list-inside">
                {exp.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}

            {exp.technologies && exp.technologies.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-1">
                {exp.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit Experience Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExp ? 'Edit Experience' : 'Add New Position'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Position / Role Title"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              required
            />
            <Input
              label="Company / Organization"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Company Name"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Start Date (YYYY-MM)"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="2023-08"
              required
            />
            <Input
              label="End Date (YYYY-MM)"
              value={endDate}
              disabled={isCurrent}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="2024-05"
            />
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Remote / Colombo"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={isCurrent}
              onChange={(e) => setIsCurrent(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-indigo-600"
            />
            <span>Currently Working Here (Present)</span>
          </label>

          <Textarea
            label="Overview Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Describe your role or leave empty..."
          />

          <Textarea
            label="Key Responsibilities (1 per line)"
            value={responsibilitiesText}
            onChange={(e) => setResponsibilitiesText(e.target.value)}
            rows={3}
            placeholder="Architected distributed message brokers&#10;Optimized PostgreSQL database query latency"
          />

          <Textarea
            label="Key Achievements / Milestones (1 per line)"
            value={achievementsText}
            onChange={(e) => setAchievementsText(e.target.value)}
            rows={2}
            placeholder="Reduced P99 latency by 45%&#10;Zero downtime deployment"
          />

          <Input
            label="Technologies Used (comma separated)"
            value={technologiesText}
            onChange={(e) => setTechnologiesText(e.target.value)}
            placeholder="TypeScript, Docker, Redis, PostgreSQL"
          />

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
              {editingExp ? 'Save Changes' : 'Add Position'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
