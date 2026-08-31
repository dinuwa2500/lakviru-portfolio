'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Sparkles, MapPin } from 'lucide-react';
import { Github, Linkedin } from '@/components/ui/Icons';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { submitContactFormAction } from '@/actions/contact';
import { ProfileData } from '@/types';

interface ContactFormProps {
  profile: ProfileData;
}

export function ContactForm({ profile }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(submitContactFormAction, null);
  const [formSubmitted, setFormSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (state?.success) {
      setFormSubmitted(true);
    }
  }, [state]);

  return (
    <section id='contact' className='py-16 sm:py-24 relative'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12'>
        {/* Section Heading */}
        <div className='space-y-3 text-center max-w-2xl mx-auto'>
          <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'>
            <Mail className='h-3.5 w-3.5' />
            <span>Initiate Contact</span>
          </div>
          <h2 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50'>
            Let&apos;s Build Something Resilient
          </h2>
          <p className='text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed'>
            Interested in discussing an engineering role, technical consulting,
            or software architecture? Send a direct message below.
          </p>
        </div>

        {/* 2-Column Layout: Direct Details + Form */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto'>
          {/* Left Column: Direct Info */}
          <div className='lg:col-span-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-6 sm:p-8 space-y-6'>
            <div className='space-y-2'>
              <h3 className='text-lg font-bold text-zinc-900 dark:text-zinc-100'>
                Direct Contact Channels
              </h3>
              <p className='text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed'>
                Feel free to email me directly or connect across professional
                networks.
              </p>
            </div>

            <div className='space-y-4 text-xs sm:text-sm'>
              <div className='flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60'>
                <div className='p-2 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'>
                  <Mail className='h-4 w-4' />
                </div>
                <div>
                  <div className='text-[11px] font-mono uppercase text-zinc-400'>
                    Email Address
                  </div>
                  <a
                    href={`mailto:dinuwaperera123@gmail.com`}
                    className='font-semibold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                  >
                    dinuwaperera123@gmail.com
                  </a>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60'>
                <div className='p-2 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'>
                  <MapPin className='h-4 w-4' />
                </div>
                <div>
                  <div className='text-[11px] font-mono uppercase text-zinc-400'>
                    Location
                  </div>
                  <div className='font-semibold text-zinc-900 dark:text-zinc-100'>
                    {profile.location}
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60'>
                <div className='p-2 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'>
                  <Linkedin className='h-4 w-4' />
                </div>
                <div>
                  <div className='text-[11px] font-mono uppercase text-zinc-400'>
                    LinkedIn
                  </div>
                  <a
                    href={profile.linkedinUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-semibold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                  >
                    /in/{profile.name.toLowerCase().replace(/\s+/g, "")}
                  </a>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60'>
                <div className='p-2 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'>
                  <Github className='h-4 w-4' />
                </div>
                <div>
                  <div className='text-[11px] font-mono uppercase text-zinc-400'>
                    GitHub
                  </div>
                  <a
                    href={profile.githubUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-semibold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                  >
                    @dinuwa2500
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className='lg:col-span-7 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-sm'>
            {formSubmitted ? (
              <div className='text-center py-10 space-y-4 animate-in fade-in zoom-in-95 duration-300'>
                <div className='inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'>
                  <CheckCircle2 className='h-8 w-8' />
                </div>
                <div className='space-y-1.5'>
                  <h3 className='text-xl font-bold text-zinc-900 dark:text-zinc-100'>
                    Message Dispatched Successfully!
                  </h3>
                  <p className='text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto'>
                    {state?.message ||
                      "Thank you for getting in touch. I will review your message and reply promptly."}
                  </p>
                </div>
                <Button
                  onClick={() => setFormSubmitted(false)}
                  variant='outline'
                  size='sm'
                  className='mt-4'
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form action={formAction} className='space-y-4'>
                {state?.error && (
                  <div className='p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs sm:text-sm flex items-center gap-2'>
                    <AlertCircle className='h-4 w-4 shrink-0' />
                    <span>{state.error}</span>
                  </div>
                )}

                {/* Honeypot field (hidden from regular users) */}
                <div className='hidden' aria-hidden='true'>
                  <input
                    type='text'
                    name='website_url'
                    tabIndex={-1}
                    autoComplete='off'
                  />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <Input
                    label='Your Name'
                    name='name'
                    placeholder='e.g. Alex Smith'
                    required
                  />
                  <Input
                    label='Email Address'
                    name='email'
                    type='email'
                    placeholder='alex@company.com'
                    required
                  />
                </div>

                <Input
                  label='Subject'
                  name='subject'
                  placeholder='e.g. Software Engineering Opportunity / System Architecture'
                  required
                />

                <Textarea
                  label='Message'
                  name='message'
                  rows={5}
                  placeholder='Describe your project, team, or inquiry...'
                  required
                />

                <div className='pt-2'>
                  <Button
                    type='submit'
                    variant='primary'
                    size='lg'
                    isLoading={isPending}
                    className='w-full gap-2'
                  >
                    <Send className='h-4 w-4' />
                    <span>
                      {isPending ? "Sending Message..." : "Send Message"}
                    </span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
