import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Lakviru Perera | Software Engineer',
    template: '%s | Lakviru Perera',
  },
  description:
    'Software Engineer specializing in scalable distributed backend systems, cloud-native architecture, and modern full-stack web applications.',
  keywords: [
    'Lakviru Perera',
    'Software Engineer',
    'Backend Engineer',
    'Full Stack Developer',
    'Next.js',
    'TypeScript',
    'PostgreSQL',
    'Distributed Systems',
    'Cloud Architecture',
  ],
  authors: [{ name: 'Lakviru Perera' }],
  creator: 'Lakviru Perera',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lakviru.dev',
    title: 'Lakviru Perera | Software Engineer',
    description:
      'Building scalable software, modern web applications, and practical solutions using modern technologies.',
    siteName: 'Lakviru Perera Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lakviru Perera | Software Engineer',
    description:
      'Building scalable software, modern web applications, and practical solutions using modern technologies.',
    creator: '@lakviruperera',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
