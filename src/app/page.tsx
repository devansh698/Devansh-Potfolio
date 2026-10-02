import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import JsonLd from '@/components/seo/JsonLd';
import { CompanionProvider } from '@/components/providers/CompanionProvider';
import { homeJsonLd } from '@/lib/seo/structured-data';
import { llmsAlternateTypes } from '@/lib/site';
import Hero from '@/components/sections/Hero';
import Marquee from '@/components/sections/Marquee';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Work from '@/components/sections/Work';
import Experience from '@/components/sections/Experience';
import Credentials from '@/components/sections/Credentials';
import Contact from '@/components/sections/Contact';
import Preloader from '@/components/interaction/Preloader';
import Intro from '@/components/interaction/Intro';
import Companion from '@/components/interaction/Companion';
import Terminal from '@/components/interaction/Terminal';
import ProjectStory from '@/components/interaction/ProjectStory';
import TldrSheet from '@/components/interaction/TldrSheet';
import Senses from '@/components/interaction/Senses';
import Cursor from '@/components/interaction/Cursor';
import SoundDriver from '@/components/interaction/SoundDriver';

export const metadata: Metadata = {
  alternates: { canonical: '/', types: llmsAlternateTypes },
};

// The companion layer (preloader, intro, scroll lock) belongs to the home page only;
// standalone project pages must scroll freely without it.
export default function Home() {
  return (
    <CompanionProvider>
      <JsonLd data={homeJsonLd()} />
      <Preloader />
      <Intro />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Work />
        <Experience />
        <Credentials />
        <Contact />
      </main>
      <Companion />
      <Terminal />
      <ProjectStory />
      <TldrSheet />
      <Senses />
      <Cursor />
      <SoundDriver />
    </CompanionProvider>
  );
}
