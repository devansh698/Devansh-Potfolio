export type ProjectCategory = 'MERN' | 'Web';

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
  /** Theme-independent cover colour for the generated preview card. */
  tone: string;
  problem: string;
  think: string;
  build: string[];
  result: string;
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
    'Software Engineer at Oriental Outsourcing — intern to full-time inside a year, shipping production CRM systems across MERN and Laravel.',
  statement:
    'I design REST APIs, build real-time features, and care about code that’s still readable six months later. I like the parts tutorials skip: keeping a production system stable while you change it.',
} as const;

export const typedRoles = [
  'Full-Stack Developer',
  'Software Engineer',
  'MERN / Laravel Specialist',
  'REST API Architect',
  'Real-Time Systems Builder',
] as const;

export const ticker = ['React', 'Laravel', 'Node.js', 'MERN', 'Flask', 'REST APIs', 'WebSockets', 'JWT', 'MongoDB', 'MySQL', 'AWS', 'Redis'] as const;

export const stats = [
  { value: 1, suffix: '+', label: 'Year in production' },
  { value: 6, suffix: '+', label: 'Projects shipped' },
  { value: 15, suffix: '+', label: 'Certifications' },
] as const;

export const caseFile = [
  { k: 'Role', v: 'Software Engineer' },
  { k: 'Company', v: 'Oriental Outsourcing' },
  { k: 'Stack', v: 'MERN · Laravel · Flask' },
  { k: 'Based in', v: 'Haryana, India' },
  { k: 'Status', v: 'Open to new roles' },
] as const;

export const skills: Skill[] = [
  { name: 'JavaScript / SQL', level: 90, group: 'Backend' },
  { name: 'PHP / Laravel', level: 88, group: 'Backend' },
  { name: 'REST APIs / JWT', level: 85, group: 'Backend' },
  { name: 'Node.js / Express', level: 82, group: 'Backend' },
  { name: 'Python / Flask', level: 74, group: 'Backend' },
  { name: 'React.js', level: 86, group: 'Frontend' },
  { name: 'Vue.js / Inertia.js', level: 76, group: 'Frontend' },
  { name: 'MongoDB / MySQL', level: 80, group: 'Data' },
  { name: 'WebSockets / Redis', level: 78, group: 'Data' },
  { name: 'AWS', level: 68, group: 'Cloud & AI' },
  { name: 'LLM / Prompt Eng.', level: 72, group: 'Cloud & AI' },
];

export const skillGroups: SkillGroup[] = ['Backend', 'Frontend', 'Data', 'Cloud & AI'];

export const projects: Project[] = [
  {
    id: 'paypilot',
    code: 'PRJ-01',
    title: 'PayPilot',
    kind: 'Billing Management System',
    category: 'MERN',
    period: 'Jun 2024 — Dec 2024',
    year: '2024',
    desc: 'Full-stack billing platform with invoice generation, subscription tracking and RESTful APIs for invoice management.',
    stack: ['React', 'Express', 'MongoDB', 'Node.js'],
    repo: 'https://github.com/devansh698/PayPilot-smart-billing-management-system',
    tone: '#ff6b35',
    problem: 'Billing done by hand doesn’t scale. Invoices pile up, subscriptions slip through, and the numbers stop matching reality.',
    think: 'Split the domain into clean resources — invoices, subscriptions, payments — each behind its own REST endpoint, with one source of truth in MongoDB.',
    build: ['mounting REST endpoints', 'wiring invoice generator', 'tracking subscriptions', 'validating payloads'],
    result: 'A billing platform that generates invoices, tracks subscriptions, and keeps financial data consistent end to end.',
  },
  {
    id: 'careconnect',
    code: 'PRJ-02',
    title: 'CareConnect',
    kind: 'Healthcare Platform',
    category: 'MERN',
    period: '2024 — 2025',
    year: '2025',
    desc: 'Doctor–patient appointment booking with a responsive React UI and AI-based preliminary health assistance.',
    stack: ['React', 'Bootstrap', 'Node.js', 'MongoDB'],
    repo: null,
    tone: '#5b7cff',
    problem: 'Getting a doctor’s appointment is a phone queue and a paper calendar. Patients wait; doctors double-book.',
    think: 'Two-sided booking: doctors publish availability, patients book against it — plus an AI layer for preliminary guidance before the visit.',
    build: ['booting React UI', 'appointment engine', 'AI assist layer', 'responsive pass'],
    result: 'A doctor–patient platform where booking takes seconds and preliminary guidance happens before the waiting room.',
  },
  {
    id: 'banking-dashboard',
    code: 'PRJ-03',
    title: 'Banking Dashboard',
    kind: 'Transaction Analytics',
    category: 'Web',
    period: '2024',
    year: '2024',
    desc: 'Interactive transaction dashboard with data visualisation and optimised handling for large datasets.',
    stack: ['React', 'Node.js', 'MongoDB'],
    repo: null,
    tone: '#2bb673',
    problem: 'Large transaction sets choke naive dashboards — slow renders, frozen filters, users staring at spinners.',
    think: 'Push the heavy lifting to the API, visualise aggregates, and hydrate detail only on demand so the UI stays light.',
    build: ['aggregation endpoints', 'chart pipeline', 'large-dataset paths'],
    result: 'An analytics dashboard that stays smooth while slicing through large transaction datasets.',
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
    tone: '#b0683f',
    problem: 'A coffee brand needs a fast, beautiful presence — not a heavyweight stack for a menu and a story.',
    think: 'Static-first: plain HTML, CSS and JavaScript with dynamic menu filtering and a cart preview. No framework overhead.',
    build: ['layout + typography', 'menu filtering', 'scroll animations'],
    result: 'A responsive brand site that loads instantly and still feels alive.',
  },
];

export const projectFilters = ['All', 'MERN', 'Web'] as const;
export type ProjectFilter = (typeof projectFilters)[number];

export const roles: Role[] = [
  {
    code: 'EXP-01',
    period: 'May 2026 — Present',
    title: 'Software Engineer',
    org: 'Oriental Outsourcing',
    points: [
      'Promoted from intern to full-time engineer — own end-to-end feature delivery on live production CRM systems.',
      'Design and ship REST APIs, optimise database queries, and lead front-end components across MERN and Laravel.',
      'Build WebSocket-based real-time functionality, authentication, and CRUD modules used by active customers daily.',
    ],
    stack: ['MERN', 'Laravel', 'REST APIs', 'WebSockets', 'Redis'],
  },
  {
    code: 'EXP-02',
    period: 'May 2025 — May 2026',
    title: 'Software Developer Intern',
    org: 'Oriental Outsourcing',
    points: [
      'Built two full-stack CRM applications from scratch using Flask, the MERN stack, and Laravel.',
      'Contributed feature development and bug fixes to live production code under real-world constraints.',
    ],
    stack: ['Flask', 'MERN', 'Laravel', 'MySQL'],
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
