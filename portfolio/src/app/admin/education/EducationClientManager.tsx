'use client';

import * as React from 'react';
import { Plus, Edit, Trash2, CheckCircle2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { createEducationAction, updateEducationAction, deleteEducationAction } from '@/actions/education';
import { EducationData } from '@/types';

interface EducationClientManagerProps {
  initialEducations: EducationData[];
}

export function EducationClientManager({ initialEducations }: EducationClientManagerProps) {
  const [educations, setEducations] = React.useState<EducationData[]>(initialEducations);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingEdu, setEditingEdu] = React.useState<EducationData | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  // Form state
  const [institution, setInstitution] = React.useState('');
  const [degree, setDegree] = React.useState('');
  const [field, setField] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [startDate, setStartDate] = React.useState('2020');
  const [endDate, setEndDate] = React.useState('2024');
  const [isCurrent, setIsCurrent] = React.useState(false);
  const [grade, setGrade] = React.useState('First Class Honours');
  const [description, setDescription] = React.useState('');
  const [displayOrder, setDisplayOrder] = React.useState(1);

  const openAddModal = () => {
    setEditingEdu(null);
    setInstitution('');
    setDegree('BSc (Hons) in Computer Science');
    setField('Software Engineering');
    setLocation('Colombo, Sri Lanka');
    setStartDate('2020');
    setEndDate('2024');
    setIsCurrent(false);
    setGrade('First Class Honours');
    setDescription('');
    setDisplayOrder(educations.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (edu: EducationData) => {
    setEditingEdu(edu);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    setField(edu.field);
    setLocation(edu.location || '');
    setStartDate(edu.startDate);
    setEndDate(edu.endDate || '');
    setIsCurrent(edu.isCurrent || false);
    setGrade(edu.grade || '');
    setDescription(edu.description || '');
    setDisplayOrder(edu.displayOrder || 1);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim()) return;

    setIsSaving(true);
    try {
      if (editingEdu) {
        const res = await updateEducationAction(editingEdu.id, {
          institution,
          degree,
          field,
          location: location || null,
          startDate,
          endDate: isCurrent ? null : endDate || null,
          isCurrent,
          grade: grade || null,
          description: description || null,
          displayOrder: Number(displayOrder),
        });
        if (res.success && res.education) {
          setEducations((prev) => prev.map((e) => (e.id === editingEdu.id ? res.education! : e)));
          setFeedback('Education updated successfully!');
        }
      } else {
        const res = await createEducationAction({
          institution,
          degree,
          field,
          location: location || null,
          startDate,
          endDate: isCurrent ? null : endDate || null,
          isCurrent,
          grade: grade || null,
          description: description || null,
          displayOrder: Number(displayOrder),
        });
        if (res.success && res.education) {
          setEducations((prev) => [...prev, res.education!]);
          setFeedback('Education added successfully!');
        }
      }
      setIsModalOpen(false);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Failed to save education');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    setEducations((prev) => prev.filter((e) => e.id !== id));
    await deleteEducationAction(id);
    setFeedback('Education entry removed');
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
            Education & Degrees ({educations.length})
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Manage academic background, degrees, institutions, and honors
          </p>
        </div>
        <Button onClick={openAddModal} variant="primary" size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span>Add Education</span>
        </Button>
      </div>

      <div className="space-y-4">
        {educations.map((edu) => (
          <div
            key={edu.id}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 space-y-3 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {edu.degree} &mdash; <span className="text-indigo-600 dark:text-indigo-400">{edu.institution}</span>
                </h3>
                <div className="text-xs text-zinc-500 font-mono mt-0.5">
                  Field: {edu.field} • {edu.startDate} - {edu.endDate || 'Present'} {edu.grade ? `(${edu.grade})` : ''}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="secondary" onClick={() => openEditModal(edu)} className="p-1.5">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <button
                  onClick={() => handleDelete(edu.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {edu.description && (
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {edu.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit Education Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEdu ? 'Edit Education' : 'Add New Degree'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Degree Title"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            placeholder="e.g. BSc (Hons) in Computer Science"
            required
          />

          <Input
            label="Institution / University"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder="e.g. University of Westminster"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Field of Study"
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder="Software Engineering"
              required
            />
            <Input
              label="Grade / Honours (Optional)"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="First Class Honours"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Start Year"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="2020"
              required
            />
            <Input
              label="End Year"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="2024"
            />
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Colombo"
            />
          </div>

          <Textarea
            label="Academic Overview & Modules"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Algorithms, distributed systems, operating systems, compiler theory..."
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
              {editingEdu ? 'Save Changes' : 'Add Degree'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
