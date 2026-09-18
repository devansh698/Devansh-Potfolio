/**
 * Every line the companion can say, in one place — conversational,
 * first-person, never corporate. Keeping copy centralized makes tone
 * easy to audit and edit without touching behavior.
 */
export const SCRIPT = {
  intro: {
    lines: ['Oh… you\u2019re here.', 'I\u2019m Devansh.', 'Want to see what I\u2019ve built?'],
    enter: 'ENTER',
    skip: 'skip intro',
    hintCursor: 'Try moving your cursor.',
    hintTouch: 'Tap anywhere.',
    nameAsk: 'What should I call you?',
    namePlaceholder: 'Your name',
    nameSkip: 'Skip',
    nameGo: 'Continue',
    nameHello: (n) => `Nice to meet you, ${n}.`,
    nameSkipped: 'No problem. Let\u2019s continue.',
    routeAsk: 'What are you interested in?',
    routes: [
      { id: 'building', label: 'BUILDING', desc: 'the projects', target: '#projects' },
      { id: 'engineering', label: 'ENGINEERING', desc: 'the toolkit', target: '#skills' },
      { id: 'journey', label: 'JOURNEY', desc: 'how I got here', target: '#experience' },
    ],
    wander: 'I\u2019ll wander',
  },

  // One-time observations as the visitor reaches each zone.
  zones: {
    home: 'You can move around — scroll whenever you\u2019re ready.',
    about: 'That\u2019s the human behind the commits.',
    skills: 'The toolkit. This is where the interesting stuff begins.',
    projects: 'You found the projects. Click one — they open up.',
    experience: 'The pretty part is over. Let\u2019s look under the hood.',
    contact: null, // handled by the farewell sequence
  },

  routeFollowUp: {
    building: 'Straight to the work. Respect.',
    engineering: 'Sensible. Tools first.',
    journey: 'The long way around — I like it.',
  },

  revisit: 'Back again?',
  idleNudge: 'Still with me? The glowing bits are clickable.',
  projectInterest: 'You seem interested in this one.',
  storyOpen: 'Let\u2019s take a closer look.',
  fastScroll: 'Whoa — in a hurry?',

  secretFound: 'You weren\u2019t supposed to find this.',
  terminalGranted: 'Permission granted.',
  startOver: 'Round two, then.',

  farewell: {
    thanks: (n) => (n ? `Thanks for exploring, ${n}.` : 'Thanks for exploring.'),
    build: 'Now let\u2019s build something.',
  },

  // Short reactions when the visitor pokes the companion directly.
  pokes: [
    'Hey.',
    'Careful — I\u2019m load-bearing.',
    'I\u2019m watching the cursor. It\u2019s my job.',
    'Try the terminal. Press ` sometime.',
    'Back to exploring.',
  ],
};
