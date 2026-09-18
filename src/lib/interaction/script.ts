/**
 * Every line the companion can say, in one place — first-person, never corporate.
 * Centralised so tone can be audited without touching behaviour.
 */
export const SCRIPT = {
  intro: {
    lines: ['Oh… you’re here.', 'I’m Devansh’s little helper.', 'Want to see what he’s built?'],
    enter: 'Enter',
    skip: 'Skip intro',
    hintCursor: 'Try moving your cursor.',
    hintTouch: 'Tap anywhere.',
    nameAsk: 'What should I call you?',
    namePlaceholder: 'Your name',
    nameSkip: 'Skip',
    nameGo: 'Continue',
    nameHello: (n: string) => `Nice to meet you, ${n}.`,
    nameSkipped: 'No problem. Let’s continue.',
    privacy: 'Stays in this tab · never stored · never sent',
    routeAsk: 'What are you interested in?',
    routes: [
      { id: 'building', label: 'Building', desc: 'the projects', target: '#work' },
      { id: 'engineering', label: 'Engineering', desc: 'the toolkit', target: '#skills' },
      { id: 'journey', label: 'Journey', desc: 'how he got here', target: '#experience' },
    ],
    wander: 'I’ll wander',
  },

  zones: {
    top: 'Psst — everything on the desk is clickable.',
    about: 'That’s the human behind the commits.',
    skills: 'The toolkit. Filter it, hover the bars.',
    work: 'You found the projects. Click one — they open up.',
    experience: 'The pretty part is over. Let’s look under the hood.',
    certs: 'Homework, basically. Lots of it.',
  } as Record<string, string>,

  routeFollowUp: {
    building: 'Straight to the work. Respect.',
    engineering: 'Sensible. Tools first.',
    journey: 'The long way around — I like it.',
  } as Record<string, string>,

  greet: (n: string) => (n ? `Welcome back to the desk, ${n}.` : ''),
  revisit: 'Back again?',
  idleNudge: 'Still with me? Try pressing ` for a secret.',
  projectInterest: 'You seem interested in this one.',
  storyOpen: 'Let’s take a closer look.',
  fastScroll: 'Whoa — in a hurry? Try the TL;DR button.',
  themeChanged: (t: string) => `${t} mode. Nice pick.`,
  secretFound: 'You weren’t supposed to find this.',
  startOver: 'Round two, then.',
  copied: 'Email copied. Your move.',

  desk: {
    monitor: 'Booting the terminal…',
    mug: 'Coffee refilled. Productivity +12%.',
    plant: 'Watered. It says thanks.',
    books: 'The short version, coming up.',
  },

  farewell: {
    thanks: (n: string) => (n ? `Thanks for exploring, ${n}.` : 'Thanks for exploring.'),
    build: 'Now let’s build something.',
  },

  pokes: [
    'Hey.',
    'Careful — I’m load-bearing.',
    'I watch the cursor. It’s my job.',
    'Press ` sometime.',
    'Try clicking the mug on the desk.',
    'Back to exploring.',
  ],
} as const;
