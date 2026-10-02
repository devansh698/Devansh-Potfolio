export type ProjectCategory = 'AI' | 'MERN' | 'Web';

export interface Project {
  id: string;
  code: string;
  title: string;
  kind: string;
  category: ProjectCategory;
  period: string;
  year: string;
  desc: string;
  stack: string[];
  repo: string | null;
  /** Public deployment, when one exists. */
  live: string | null;
  /** False when the live site sends X-Frame-Options / frame-ancestors that forbid embedding. */
  isFrameable: boolean;
  /** Screenshot of the live site in /public; projects without one fall back to the generated plate. */
  image: string | null;
  /** Theme-independent cover colour for the generated preview card. */
  tone: string;
  problem: string;
  think: string;
  build: string[];
  result: string;
  /** Optional long-form case-study content; only flagship projects carry it. */
  feature?: ProjectFeature;
}

/** Long-form detail for a flagship project's case study and featured section. */
export interface ProjectFeature {
  tagline: string;
  role: string;
  /** Honest scope caveat shown wherever the project is presented. */
  note: string;
  features: { title: string; body: string }[];
  highlights: { title: string; body: string }[];
  stackTable: { layer: string; tech: string }[];
  scale: { value: string; label: string }[];
}

export interface Role {
  code: string;
  period: string;
  title: string;
  org: string;
  points: string[];
  stack: string[];
}

export interface Credential {
  title: string;
  org: string;
  date?: string;
  url: string;
}

export interface Skill {
  name: string;
  level: number;
  group: SkillGroup;
}

export type SkillGroup = 'Backend' | 'Frontend' | 'Data' | 'Cloud & AI';

export const profile = {
  name: 'Devansh Handa',
  firstName: 'Devansh',
  lastName: 'Handa',
  initials: 'DH',
  role: 'Software Engineer',
  company: 'Oriental Outsourcing',
  location: 'Haryana, India',
  timeZone: 'Asia/Kolkata',
  timeZoneLabel: 'IST',
  email: 'devanshhanda0001@gmail.com',
  phone: '+91 70827-90009',
  github: 'https://github.com/devansh698',
  linkedin: 'https://www.linkedin.com/in/devanshhanda',
  intro:
    'Software Engineer and Claude Certified Developer building Generative AI and LLM features into real products — APIs, real-time systems and the data layer underneath.',
  statement:
    'I build software where AI does useful work, not just demos: LLM integrations, prompt engineering and AI features that stay reliable in production. I like the parts tutorials skip — evaluating outputs, handling failures, and keeping a live system stable while you change it.',
} as const;

export const typedRoles = [
  'Generative AI Engineer',
  'Claude Certified Developer',
  'LLM App Builder',
  'Prompt Engineer',
  'Full-Stack Software Engineer',
] as const;

export const ticker = ['Generative AI', 'LLMs', 'Claude API', 'Prompt Engineering', 'Python', 'React', 'Next.js', 'Node.js', 'REST APIs', 'WebSockets', 'AWS', 'MongoDB', 'MySQL'] as const;

export const stats = [
  { value: 1, suffix: '+', label: 'Year in production' },
  { value: 6, suffix: '+', label: 'Projects shipped' },
  { value: 15, suffix: '+', label: 'Certifications' },
] as const;

export const caseFile = [
  { k: 'Role', v: 'Software Engineer' },
  { k: 'Company', v: 'Oriental Outsourcing' },
  { k: 'Focus', v: 'Generative AI · LLM apps' },
  { k: 'Certified', v: 'Claude Developer (Anthropic)' },
  { k: 'Based in', v: 'Haryana, India' },
  { k: 'Status', v: 'Open to AI Engineer / GenAI roles' },
] as const;

export const skills: Skill[] = [
  { name: 'JavaScript / SQL', level: 90, group: 'Backend' },
  { name: 'REST APIs / JWT', level: 86, group: 'Backend' },
  { name: 'Node.js / Express', level: 84, group: 'Backend' },
  { name: 'Python', level: 80, group: 'Backend' },
  { name: 'React.js', level: 86, group: 'Frontend' },
  { name: 'Next.js', level: 78, group: 'Frontend' },
  { name: 'MongoDB / MySQL', level: 80, group: 'Data' },
  { name: 'WebSockets / Redis', level: 78, group: 'Data' },
  { name: 'LLM Integration (Claude API)', level: 84, group: 'Cloud & AI' },
  { name: 'Prompt Engineering', level: 86, group: 'Cloud & AI' },
  { name: 'Generative AI / ML', level: 76, group: 'Cloud & AI' },
  { name: 'AWS', level: 70, group: 'Cloud & AI' },
];

export const skillGroups: SkillGroup[] = ['Backend', 'Frontend', 'Data', 'Cloud & AI'];

export const projects: Project[] = [
  {
    id: 'finpilot',
    code: 'PRJ-01',
    title: 'FinPilot AI',
    kind: 'AI Personal Finance Platform',
    category: 'AI',
    period: '2026',
    year: '2026',
    desc: 'Every account in one dashboard, plus an AI Copilot that answers money questions from the user’s real numbers — with a fraud-risk engine, cash-flow forecast and health score.',
    stack: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Prisma', 'Redis', 'BullMQ', 'LLM tool use'],
    repo: null,
    live: 'https://finpilot.devanshhanda.in/',
    isFrameable: false,
    image: '/projects/finpilot.webp',
    tone: '#2bb673',
    problem: 'Money lives across bank apps, cards, investments, loans, UPI and subscriptions. Simple questions — how much do I actually have, can I afford this, is this charge suspicious — have no single place to be answered.',
    think: 'Unify every account into one model, then put an AI Copilot on top that can only read data through validated, audited tools. The user ID is injected on the server, never taken from the model, and every number on screen comes from a tool result — not from generated text.',
    build: ['bigint money package', 'categorisation pipeline', 'fraud-risk scoring', '60-day cash-flow forecast', 'tool-using AI Copilot', 'audit-logged tool calls'],
    result: 'A financial command center on 12 months of deterministic demo data: net worth, explainable fraud flags, a forecast with stated assumptions and a 0–100 health score — all answerable in chat.',
    feature: {
      tagline: 'One place for every account. One AI for your finances.',
      role: 'Solo full-stack developer — architecture, backend, AI integration, security and frontend.',
      note: 'Runs on generated demo data — real bank connections are not built yet.',
      features: [
        { title: 'AI Copilot', body: 'Streaming chat with read-only tools over balances, spending, budgets, bills, forecasts and risk signals. Modes for Security, Money, Analytics, Goals and Search.' },
        { title: 'Fraud & risk engine', body: 'Each transaction scored by statistical rules — amount outliers, new merchants, foreign location, unusual hours, velocity bursts — with plain explanations and “That’s me” / report actions.' },
        { title: 'Smart categorisation', body: 'Five stages: user rules → ~300 seeded Indian merchants → pattern rules → batched, cached AI classification (each merchant hits the model once) → uncategorised.' },
        { title: 'Cash-flow forecast', body: '60-day projection with a lowest-balance warning and a “Can I afford it?” check that lists its assumptions.' },
        { title: 'Financial health score', body: 'A 0–100 score built from six sub-scores — savings, debt, credit use, budget adherence, emergency fund, cash flow — each with its reasons.' },
        { title: 'Budgets, goals & bills', body: 'Recurring payments detected automatically, including price-hike alerts. A Privacy Center shows exactly which data the AI can read.' },
      ],
      highlights: [
        { title: 'AI safety by design', body: 'Server-injected user ID, zod-validated tool arguments, tool data wrapped as untrusted against prompt injection, every tool call audit-logged, and refusal of personalised investment advice.' },
        { title: 'Answers you can check', body: 'Charts and cards render from tool results, not the model’s text — so the numbers can’t be made up.' },
        { title: 'Deterministic demo data', body: 'A seeded generator builds 12 months of realistic Indian banking data for one persona, with planted fraud scenarios, so screenshots and evals stay stable.' },
        { title: 'Money as bigint', body: 'No floating-point rounding errors anywhere; INR formatting throughout.' },
        { title: 'Security-first', body: 'Argon2 hashing, JWT, TOTP MFA, Google and Apple OAuth with PKCE, rate limiting, Helmet headers, encrypted secrets and generic client errors.' },
        { title: 'Accessible & translatable', body: 'Every user-facing string goes through translation files; light and dark themes with switchable colour palettes.' },
      ],
      stackTable: [
        { layer: 'Frontend', tech: 'Next.js 16, React 19, TypeScript, TanStack Query, Recharts, Motion, next-intl' },
        { layer: 'Backend', tech: 'NestJS, Prisma, PostgreSQL, Redis, BullMQ' },
        { layer: 'AI', tech: 'Provider-agnostic LLM layer — Anthropic, OpenAI and a mock provider for tests' },
        { layer: 'Auth', tech: 'Argon2, JWT (jose), TOTP MFA, Google & Apple OAuth (PKCE)' },
        { layer: 'Monorepo', tech: 'pnpm workspaces, Turborepo, shared zod contracts, bigint money package' },
        { layer: 'Quality', tech: 'Vitest, Testcontainers integration tests, AI eval suite, ESLint, Prettier' },
      ],
      scale: [
        { value: '25', label: 'Backend modules' },
        { value: '15+', label: 'App screens' },
        { value: '77', label: 'Test files' },
        { value: '~90', label: 'Commits' },
      ],
    },
  },
  {
    id: 'paypilot',
    code: 'PRJ-02',
    title: 'PayPilot',
    kind: 'Billing Management System',
    category: 'MERN',
    period: 'Jun 2024 — Dec 2024',
    year: '2024',
    desc: 'Full-stack billing platform with invoice generation, subscription tracking and RESTful APIs for invoice management.',
    stack: ['React', 'Express', 'MongoDB', 'Node.js'],
    repo: 'https://github.com/devansh698/PayPilot-smart-billing-management-system',
    live: 'https://paypilot.devanshhanda.in/',
    isFrameable: true,
    image: '/projects/paypilot.webp',
    tone: '#ff6b35',
    problem: 'Billing done by hand doesn’t scale. Invoices pile up, subscriptions slip through, and the numbers stop matching reality.',
    think: 'Split the domain into clean resources — invoices, subscriptions, payments — each behind its own REST endpoint, with one source of truth in MongoDB.',
    build: ['mounting REST endpoints', 'wiring invoice generator', 'tracking subscriptions', 'validating payloads'],
    result: 'A billing platform that generates invoices, tracks subscriptions, and keeps financial data consistent end to end.',
  },
  {
    id: 'careconnect',
    code: 'PRJ-03',
    title: 'CareConnect',
    kind: 'Healthcare Platform',
    category: 'AI',
    period: '2024 — 2025',
    year: '2025',
    desc: 'Doctor–patient appointment booking with an LLM-powered assistant that gives patients early guidance before their visit.',
    stack: ['React', 'Node.js', 'MongoDB', 'LLM', 'Prompt Engineering'],
    repo: null,
    live: null,
    isFrameable: false,
    image: null,
    tone: '#5b7cff',
    problem: 'Getting a doctor’s appointment is a phone queue and a paper calendar. Patients wait; doctors double-book.',
    think: 'Two-sided booking: doctors publish availability, patients book against it — plus an LLM layer with guarded prompts that gives preliminary guidance, never a diagnosis.',
    build: ['booting React UI', 'appointment engine', 'LLM assist layer', 'prompt guardrails', 'responsive pass'],
    result: 'A doctor–patient platform where booking takes seconds and preliminary guidance happens before the waiting room.',
  },
  {
    id: 'property-rental',
    code: 'PRJ-04',
    title: 'Property Rental Platform',
    kind: 'Listings & Booking',
    category: 'MERN',
    period: '2023',
    year: '2023',
    desc: 'Property listing and booking platform with a query-efficient database for fast search and availability checks.',
    stack: ['React', 'Node.js', 'MongoDB'],
    repo: 'https://github.com/devansh698/Property-Rental',
    live: 'https://apna-ghar.devanshhanda.in/',
    isFrameable: true,
    image: '/projects/property-rental.webp',
    tone: '#e0b327',
    problem: 'Property search collapses when the schema isn’t built for filtering — every availability check becomes a slow scan.',
    think: 'Design the database around the queries: indexed search fields and availability modelled for fast, direct lookups.',
    build: ['schema + indexes', 'search endpoints', 'booking flow'],
    result: 'Listing and booking flows with fast search and availability checks that don’t make the visitor wait.',
  },
  {
    id: 'todo',
    code: 'PRJ-05',
    title: 'To-Do List App',
    kind: 'Task Manager',
    category: 'Web',
    period: '2024',
    year: '2024',
    desc: 'Full-stack task manager with priorities, due dates, drag-and-drop reordering, categories and JWT auth.',
    stack: ['React', 'Express', 'MongoDB', 'JWT'],
    repo: 'https://github.com/devansh698/To-Do-List',
    live: 'https://devansh698.github.io/To-Do-List/',
    isFrameable: true,
    image: '/projects/todo.webp',
    tone: '#9b6bff',
    problem: 'Task apps get abandoned when organising the list is more work than doing the tasks.',
    think: 'Priorities, due dates, categories and drag-and-drop reordering — all behind JWT auth so every list follows its owner.',
    build: ['JWT auth', 'task CRUD', 'drag-and-drop reorder'],
    result: 'A task manager that stays out of the way — reorder with a drag, filter by what actually matters.',
  },
  {
    id: 'correto',
    code: 'PRJ-06',
    title: 'Correto Caffé',
    kind: 'Coffee Brand Website',
    category: 'Web',
    period: 'Feb 2025 — May 2025',
    year: '2025',
    desc: 'Responsive brand site with dynamic menu filtering, cart preview and smooth scroll animations.',
    stack: ['HTML5', 'CSS3', 'JavaScript'],
    repo: 'https://github.com/devansh698/Cafe-Website',
    live: 'https://devansh698.github.io/Cafe-Website/img1/index.html',
    isFrameable: true,
    image: '/projects/correto.webp',
    tone: '#b0683f',
    problem: 'A coffee brand needs a fast, beautiful presence — not a heavyweight stack for a menu and a story.',
    think: 'Static-first: plain HTML, CSS and JavaScript with dynamic menu filtering and a cart preview. No framework overhead.',
    build: ['layout + typography', 'menu filtering', 'scroll animations'],
    result: 'A responsive brand site that loads instantly and still feels alive.',
  },
];

export const projectFilters = ['All', 'AI', 'MERN', 'Web'] as const;
export type ProjectFilter = (typeof projectFilters)[number];

export const roles: Role[] = [
  {
    code: 'EXP-01',
    period: 'May 2026 — Present',
    title: 'Software Engineer',
    org: 'Oriental Outsourcing',
    points: [
      'Promoted from intern to full-time engineer — own end-to-end feature delivery on live production systems.',
      'Design and ship REST APIs, optimise database queries, and lead front-end components.',
      'Build WebSocket-based real-time functionality, authentication, and CRUD modules used by active customers daily.',
    ],
    stack: ['Node.js', 'React', 'REST APIs', 'WebSockets', 'Redis'],
  },
  {
    code: 'EXP-02',
    period: 'May 2025 — May 2026',
    title: 'Software Developer Intern',
    org: 'Oriental Outsourcing',
    points: [
      'Built two full-stack CRM applications from scratch with Python and the MERN stack.',
      'Contributed feature development and bug fixes to live production code under real-world constraints.',
    ],
    stack: ['Python', 'MERN', 'REST APIs', 'MySQL'],
  },
  {
    code: 'EXP-03',
    period: 'Apr 2024 — Jun 2024',
    title: 'Virtual Summer Intern',
    org: 'Cisco · AICTE',
    points: [
      'Configured and troubleshot networks — routing, switching, automation — using Cisco Packet Tracer.',
      'Gained exposure to network security fundamentals and cloud computing concepts.',
    ],
    stack: ['Networking', 'Cybersecurity', 'Cisco Tools'],
  },
];

export const education = [
  { period: '2022 — 2026', title: 'B.E. Computer Science & Engineering', org: 'Chitkara University' },
  { period: '2021 — 2022', title: 'Senior Secondary (XII), PCM', org: 'D.A.V. Public School, Kurukshetra' },
] as const;

export const specializations: Credential[] = [
  { title: 'Claude Certified Developer – Foundations', org: 'Anthropic', date: 'Oct 2026', url: 'https://www.credly.com/badges/be4ca1b7-ffcf-4438-9a72-d9b503b4e253/public_url' },
  { title: 'IBM Machine Learning Professional Certificate', org: 'IBM', date: 'Mar 2025', url: 'https://www.coursera.org/account/accomplishments/professional-cert/FQR1P1VD7CR7' },
  { title: 'Deep Learning with PyTorch, Keras & TensorFlow', org: 'IBM', date: 'Aug 2025', url: 'https://www.coursera.org/account/accomplishments/professional-cert/5JSE4KFH7WPD' },
  { title: 'AI Enterprise Workflow Specialization', org: 'IBM', date: 'Aug 2025', url: 'https://www.coursera.org/account/accomplishments/specialization/J5B8LHXDE0KG' },
  { title: 'Data Structures & Algorithms Specialization', org: 'UC San Diego', date: 'May 2025', url: 'https://www.coursera.org/account/accomplishments/specialization/XDIRQ4W55TVQ' },
  { title: 'AWS Fundamentals Specialization', org: 'Amazon Web Services', date: 'May 2025', url: 'https://www.coursera.org/account/accomplishments/specialization/ZZL0Q78PJ3YJ' },
  { title: 'Java FullStack Developer Specialization', org: 'Board Infinity', date: 'May 2025', url: 'https://www.coursera.org/account/accomplishments/specialization/EQLNTGS7BMCU' },
  { title: 'Software Product Management Specialization', org: 'University of Alberta', date: 'Feb 2026', url: 'https://www.coursera.org/account/accomplishments/specialization/031TKK6B9P0M' },
  { title: 'AI for Scientific Research Specialization', org: 'LearnQuest', date: 'Feb 2026', url: 'https://www.coursera.org/account/accomplishments/specialization/X5RAKDY7ROIQ' },
];

export const courses: Credential[] = [
  { title: 'Advanced Algorithms & Complexity', org: 'UC San Diego', url: 'https://www.coursera.org/account/accomplishments/verify/JNJHEB4COP6D' },
  { title: 'AWS Cloud Technical Essentials', org: 'AWS', url: 'https://www.coursera.org/account/accomplishments/verify/BGV632ZJDH0C' },
  { title: 'Architecting Solutions on AWS', org: 'AWS', url: 'https://www.coursera.org/account/accomplishments/verify/ELJV67XKHM6Q' },
  { title: 'Fundamentals of Java Programming', org: 'Board Infinity', url: 'https://www.coursera.org/account/accomplishments/verify/T174KJTGNVS5' },
  { title: 'Coding Interview Preparation', org: 'Meta', url: 'https://www.coursera.org/account/accomplishments/verify/LHGCL59VISAB' },
  { title: 'Generative AI: Prompt Engineering Basics', org: 'IBM', url: 'https://www.coursera.org/account/accomplishments/verify/OM8TUDM9QEI4' },
  { title: 'Foundations of Cybersecurity', org: 'Google', url: 'https://www.coursera.org/account/accomplishments/verify/AADJAT2RGKGV' },
];

export const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certs', href: '#certs' },
  { label: 'Contact', href: '#contact' },
] as const;
