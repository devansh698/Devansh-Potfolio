import type { Metadata, Viewport } from 'next';
import { Archivo, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import SmoothScroll from '@/components/providers/SmoothScroll';
import { ThemeProvider, themeBootScript } from '@/components/providers/ThemeProvider';
import { CompanionProvider } from '@/components/providers/CompanionProvider';
import './globals.css';

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  axes: ['wdth'],
});

// High-contrast serif carries the display voice; the mono carries the technical one.
const serif = Instrument_Serif({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
});

const mono = JetBrains_Mono({
  variable: '--font-mono-face',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Devansh Handa — Software Engineer',
  description:
    'Full-stack software engineer building production CRM systems with Laravel, MERN, REST APIs and real-time WebSockets.',
  openGraph: {
    title: 'Devansh Handa — Software Engineer',
    description: 'Laravel · MERN · REST APIs · Real-time systems.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#f2eee3',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" data-theme="press" className={`${archivo.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="grain">
        <ThemeProvider>
          <SmoothScroll>
            <CompanionProvider>{children}</CompanionProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
