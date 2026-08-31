'use client';

import * as React from 'react';
import { Plus, Edit, Trash2, CheckCircle2, Calendar, MapPin, X, PlusCircle } from 'lucide-react';
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
  const [responsibilities, setResponsibilities] = React.useState<string[]>([]);
  const [achievementsText, setAchievementsText] = React.useState('');
  const [technologiesText, setTechnologiesText] = React.useState('');
  const [displayOrder, setDisplayOrder] = React.useState(1);

  const openAddModal = () => {
    setEditingExp(null);
    setCompany('');
    setPosition('');
    setLocation('Piliyandala, Sri Lanka');
    setStartDate('2026-01-02');
    setEndDate('2026-07-10');
    setIsCurrent(false);
    setDescription('');
    setResponsibilities([
      'Integrated UI/UX designs into responsive and functional frontend interfaces.',
      'Contributed to Flutter mobile application development and implementation of application features.',
      'Integrated Firebase services into mobile applications where required.',
      'Worked with Docker for containerized application development and environment management.',
      'Contributed to Server-Sent Events (SSE) integration to support real-time data updates and communication.',
      'Collaborated on frontend and mobile application development tasks and contributed to the implementation of software features.',
    ]);
    setAchievementsText('');
    setTechnologiesText('Flutter, Firebase, Docker, Server-Sent Events (SSE), Frontend UI/UX');
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
    setResponsibilities(exp.responsibilities && exp.responsibilities.length > 0 ? [...exp.responsibilities] : []);
    setAchievementsText((exp.achievements || []).join('\n'));
    setTechnologiesText((exp.technologies || []).join(', '));
    setDisplayOrder(exp.displayOrder || 1);
    setIsModalOpen(true);
  };

  const handleAddResponsibility = () => {
    setResponsibilities((prev) => [...prev, '']);
  };

  const handleUpdateResponsibility = (index: number, value: string) => {
    setResponsibilities((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleRemoveResponsibility = (index: number) => {
    setResponsibilities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim()) return;

    setIsSaving(true);
    const cleanResponsibilities = responsibilities
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
          responsibilities: cleanResponsibilities,
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
          responsibilities: cleanResponsibilities,
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
            Manage your employment history, roles, key responsibilities, and tech stack tags
          </p>
        </div>
        <Button onClick={openAddModal} variant="primary" size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span>Add Position</span>
        </Button>
      </div>

      {/* Experience List Cards */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3.5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                    {exp.position}
                  </h3>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    @{exp.company}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
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
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {exp.description ? (
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {exp.description}
              </p>
            ) : null}

            {exp.responsibilities && exp.responsibilities.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                  Key Responsibilities ({exp.responsibilities.length}):
                </span>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1 list-disc list-inside">
                  {exp.responsibilities.map((r, i) => (
                    <li key={i} className="leading-relaxed">{r}</li>
                  ))}
                </ul>
              </div>
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
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Position / Role Title"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g. Software Engineering Intern"
              required
            />
            <Input
              label="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. VVH Solutions"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="2026-01-02"
              required
            />
            <Input
              label="End Date"
              value={endDate}
              disabled={isCurrent}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="2026-07-10"
            />
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Piliyandala, Sri Lanka"
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
            placeholder="Overview or leave empty..."
          />

          {/* Editable Responsibilities List */}
          <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Key Responsibilities ({responsibilities.length})
              </label>
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {responsibilities.map((resp, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) => handleUpdateResponsibility(index, e.target.value)}
                    placeholder={`Responsibility #${index + 1}`}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveResponsibility(index)}
                    className="p-1.5 rounded-md text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {responsibilities.length === 0 && (
                <p className="text-xs text-zinc-400 italic">No responsibilities added yet.</p>
              )}
            </div>
          </div>

          <Textarea
            label="Key Achievements / Milestones (Optional, 1 per line)"
            value={achievementsText}
            onChange={(e) => setAchievementsText(e.target.value)}
            rows={2}
            placeholder="Leave empty or add genuine milestones..."
          />

          <Input
            label="Technologies Used (comma separated)"
            value={technologiesText}
            onChange={(e) => setTechnologiesText(e.target.value)}
            placeholder="Flutter, Firebase, Docker, Server-Sent Events (SSE), Frontend UI/UX"
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
