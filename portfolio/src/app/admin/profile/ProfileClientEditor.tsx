'use client';

import * as React from 'react';
import { Save, CheckCircle2, AlertCircle, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { updateProfileAction } from '@/actions/profile';
import { ProfileData } from '@/types';

interface ProfileClientEditorProps {
  initialProfile: ProfileData;
}

export function ProfileClientEditor({ initialProfile }: ProfileClientEditorProps) {
  const [profile, setProfile] = React.useState<ProfileData>(initialProfile);
  const [isSaving, setIsSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [name, setName] = React.useState(profile.name);
  const [primaryTitle, setPrimaryTitle] = React.useState(profile.primaryTitle);
  const [heroSubtitle, setHeroSubtitle] = React.useState(profile.heroSubtitle);
  const [bio, setBio] = React.useState(profile.bio);
  const [location, setLocation] = React.useState(profile.location);
  const [email, setEmail] = React.useState(profile.email);
  const [githubUrl, setGithubUrl] = React.useState(profile.githubUrl);
  const [linkedinUrl, setLinkedinUrl] = React.useState(profile.linkedinUrl);
  const [twitterUrl, setTwitterUrl] = React.useState(profile.twitterUrl || '');
  const [resumeUrl, setResumeUrl] = React.useState(profile.resumeUrl || '');
  const [avatarUrl, setAvatarUrl] = React.useState(profile.avatarUrl || '');
  const [isAvailableForWork, setIsAvailableForWork] = React.useState(profile.isAvailableForWork);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await updateProfileAction({
        name,
        primaryTitle,
        heroSubtitle,
        bio,
        location,
        email,
        githubUrl,
        linkedinUrl,
        twitterUrl: twitterUrl || null,
        resumeUrl: resumeUrl || null,
        avatarUrl: avatarUrl || null,
        isAvailableForWork,
      });

      if (res.success && res.profile) {
        setProfile(res.profile);
        setFeedback({ type: 'success', message: 'Profile settings updated and saved successfully!' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update profile' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
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

      {/* Main Profile Info Card */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              Identity & Hero Details
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Personal branding and public headline metadata
            </p>
          </div>
          <Button type="submit" variant="primary" size="sm" isLoading={isSaving} className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            <span>Save Profile</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Professional Title"
            value={primaryTitle}
            onChange={(e) => setPrimaryTitle(e.target.value)}
            placeholder="Software Engineer"
            required
          />
        </div>

        <Textarea
          label="Hero Subtitle / Supporting Headline"
          value={heroSubtitle}
          onChange={(e) => setHeroSubtitle(e.target.value)}
          rows={2}
          required
        />

        <Textarea
          label="Professional Bio & Engineering Philosophy"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Colombo, Sri Lanka / Remote"
            required
          />
          <Input
            label="Public Contact Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Social & Resume Links Card */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          Professional Links & Social Media
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="GitHub Profile URL"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
            required
          />
          <Input
            label="LinkedIn Profile URL"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/..."
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Twitter / X Profile URL (Optional)"
            value={twitterUrl}
            onChange={(e) => setTwitterUrl(e.target.value)}
            placeholder="https://twitter.com/..."
          />
          <Input
            label="Resume Download Link / Path"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="/resume.pdf"
          />
        </div>

        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            <input
              type="checkbox"
              checked={isAvailableForWork}
              onChange={(e) => setIsAvailableForWork(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Show &quot;Available for Software Engineering Roles&quot; Status Badge</span>
          </label>
        </div>
      </div>
    </form>
  );
}
