'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Menu, X, Terminal } from 'lucide-react';
import { Github, Linkedin } from '@/components/ui/Icons';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface NavbarProps {
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
}

export function Navbar({
  githubUrl = "https://github.com/dinuwa2500",
  linkedinUrl = "https://www.linkedin.com/in/lakviru-perera-006050371/",
  resumeUrl = "/resume.pdf",
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Skills", href: "/#skills" },
    { name: "About", href: "/about" },
    { name: "Experience", href: "/experience" },
    { name: "Education", href: "/education" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-sm"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
        {/* Logo */}
        <Link
          href='/'
          className='flex items-center gap-2.5 font-bold text-zinc-900 dark:text-zinc-100 group'
        >
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform'>
            <Terminal className='h-4 w-4' />
          </div>
          <span className='font-mono tracking-tight text-sm sm:text-base'>
            lakviru
            <span className='text-indigo-600 dark:text-indigo-400'>.dev</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className='hidden md:flex items-center gap-1'>
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href) && !link.href.includes("#");

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100",
                )}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive && (
                  <span className="absolute inset-0 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 -z-0 border border-indigo-500/20" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className='hidden md:flex items-center gap-2.5'>
          <a
            href={githubUrl}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='GitHub Profile'
            className='p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors'
          >
            <Github className='h-4 w-4' />
          </a>
          <a
            href={linkedinUrl}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='LinkedIn Profile'
            className='p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors'
          >
            <Linkedin className='h-4 w-4' />
          </a>

          <ThemeToggle />

          <a href={resumeUrl} target='_blank' rel='noopener noreferrer'>
            <Button size='sm' variant='outline' className='gap-1.5 ml-1'>
              <FileText className='h-3.5 w-3.5' />
              <span>Resume</span>
            </Button>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className='flex md:hidden items-center gap-2'>
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors'
            aria-label='Toggle menu'
          >
            {mobileMenuOpen ? (
              <X className='h-5 w-5' />
            ) : (
              <Menu className='h-5 w-5' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className='md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200'>
          <div className='flex flex-col space-y-1'>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className='px-3 py-2 rounded-lg text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors'
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className='pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <a
                href={githubUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              >
                <Github className='h-5 w-5' />
              </a>
              <a
                href={linkedinUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              >
                <Linkedin className='h-5 w-5' />
              </a>
            </div>
            <a href={resumeUrl} target='_blank' rel='noopener noreferrer'>
              <Button size='sm' variant='outline' className='gap-1.5'>
                <FileText className='h-3.5 w-3.5' />
                <span>Resume</span>
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
