export const skills = [
  { name: 'JavaScript / SQL',     level: 90, ico: 'JS' },
  { name: 'PHP / Laravel',        level: 88, ico: '◆' },
  { name: 'React.js',             level: 86, ico: '⚛' },
  { name: 'REST APIs / JWT',      level: 85, ico: '⇄' },
  { name: 'Node.js / Express',    level: 82, ico: '▣' },
  { name: 'WebSockets / Redis',   level: 78, ico: '⌁' },
  { name: 'Vue.js / Inertia.js',  level: 76, ico: '▽' },
  { name: 'MongoDB / MySQL',      level: 80, ico: '▤' },
  { name: 'Python / Flask',       level: 74, ico: '◈' },
  { name: 'AWS',                  level: 68, ico: '☁' },
  { name: 'LLM / Prompt Eng.',    level: 72, ico: '※' },
];

export const projects = [
  {
    id: 1,
    cat: 'MERN',
    code: 'PRJ-01',
    title: 'PayPilot',
    sub: 'Billing Management System',
    period: 'Jun 2024 — Dec 2024',
    desc: 'Full-stack billing platform with invoice generation, subscription tracking, and RESTful APIs for invoice management and data handling.',
    tech: ['React', 'Express', 'MongoDB', 'Node.js'],
    gh: 'https://github.com/devansh698/PayPilot-smart-billing-management-system',
  },
  {
    id: 2,
    cat: 'MERN',
    code: 'PRJ-02',
    title: 'CareConnect',
    sub: 'Healthcare Platform',
    period: '2024 — 2025',
    desc: 'Doctor–patient appointment booking platform with a responsive React UI and integrated AI-based features for preliminary health assistance.',
    tech: ['React', 'Bootstrap', 'Node.js', 'MongoDB'],
    gh: '#',
  },
  {
    id: 3,
    cat: 'Web',
    code: 'PRJ-03',
    title: 'Banking Dashboard',
    sub: 'Transaction Analytics',
    period: '2024',
    desc: 'Interactive transaction dashboard with data visualization and optimized handling for smoother performance on large datasets.',
    tech: ['React', 'Node.js', 'MongoDB'],
    gh: '#',
  },
  {
    id: 4,
    cat: 'MERN',
    code: 'PRJ-04',
    title: 'Property Rental Platform',
    sub: 'Listings & Booking',
    period: '2023',
    desc: 'Property listing and booking platform with a structured, query-efficient database for fast search and availability checks.',
    tech: ['React', 'Node.js', 'MongoDB'],
    gh: 'https://github.com/devansh698/Property-Rental',
  },
  {
    id: 5,
    cat: 'Web',
    code: 'PRJ-05',
    title: 'To-Do List App',
    sub: 'Task Manager',
    period: '2024',
    desc: 'Full-stack task manager with priority levels, due dates, drag-and-drop reordering, categories, and JWT-based authentication.',
    tech: ['React', 'Express', 'MongoDB', 'JWT'],
    gh: 'https://github.com/devansh698/To-Do-List',
  },
  {
    id: 6,
    cat: 'Web',
    code: 'PRJ-06',
    title: 'Correto Caffé',
    sub: 'Coffee Brand Website',
    period: 'Feb 2025 — May 2025',
    desc: 'Responsive static site for a coffee brand with dynamic menu filtering, cart preview, and smooth scroll animations.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    gh: 'https://github.com/devansh698/Cafe-Website',
  },
];

export const experience = [
  {
    code: 'EXP-01',
    period: 'May 2026 — Present',
    role: 'Software Engineer',
    org: 'Oriental Outsourcing',
    accent: 'a',
    bullets: [
      'Promoted from intern to full-time engineer — own end-to-end feature delivery on live production CRM systems.',
      'Design and ship REST APIs, optimize database queries, and lead front-end components across the MERN and Laravel stacks.',
      'Build WebSocket-based real-time functionality, authentication, and CRUD modules used by active customers daily.',
    ],
    tech: ['MERN', 'Laravel', 'REST APIs', 'WebSockets', 'Redis'],
  },
  {
    code: 'EXP-02',
    period: 'May 2025 — May 2026',
    role: 'Software Developer Intern',
    org: 'Oriental Outsourcing',
    accent: 'a2',
    bullets: [
      'Built two full-stack CRM applications from scratch using Flask, the MERN stack, and Laravel.',
      'Contributed feature development and bug fixes to live production code under real-world constraints.',
    ],
    tech: ['Flask', 'MERN', 'Laravel', 'MySQL'],
  },
  {
    code: 'EXP-03',
    period: 'Apr 2024 — Jun 2024',
    role: 'Virtual Summer Intern',
    org: 'Cisco · AICTE',
    accent: 'a3',
    bullets: [
      'Configured and troubleshot networks — routing, switching, automation — using Cisco Packet Tracer.',
      'Gained exposure to network security fundamentals and cloud computing concepts.',
    ],
    tech: ['Networking', 'Cybersecurity', 'Cisco Tools'],
  },
];

export const education = [
  {
    period: '2022 — 2026',
    deg: 'B.E. Computer Science & Engineering',
    org: 'Chitkara University',
  },
  {
    period: '2021 — 2022',
    deg: 'Senior Secondary (XII), PCM',
    org: 'D.A.V. Public School, Kurukshetra',
  },
];

export const specializations = [
  { ico: '◆', title: 'IBM Machine Learning Professional Certificate',       org: 'IBM',                   date: 'Mar 2025', url: 'https://www.coursera.org/account/accomplishments/professional-cert/FQR1P1VD7CR7' },
  { ico: '◈', title: 'Deep Learning with PyTorch, Keras & TensorFlow',      org: 'IBM',                   date: 'Aug 2025', url: 'https://www.coursera.org/account/accomplishments/professional-cert/5JSE4KFH7WPD' },
  { ico: '▣', title: 'AI Enterprise Workflow Specialization',               org: 'IBM',                   date: 'Aug 2025', url: 'https://www.coursera.org/account/accomplishments/specialization/J5B8LHXDE0KG' },
  { ico: '▽', title: 'Data Structures & Algorithms Specialization',         org: 'UC San Diego',          date: 'May 2025', url: 'https://www.coursera.org/account/accomplishments/specialization/XDIRQ4W55TVQ' },
  { ico: '☁', title: 'AWS Fundamentals Specialization',                    org: 'Amazon Web Services',   date: 'May 2025', url: 'https://www.coursera.org/account/accomplishments/specialization/ZZL0Q78PJ3YJ' },
  { ico: '☕', title: 'Java FullStack Developer Specialization',            org: 'Board Infinity',        date: 'May 2025', url: 'https://www.coursera.org/account/accomplishments/specialization/EQLNTGS7BMCU' },
  { ico: '▤', title: 'Software Product Management Specialization',         org: 'University of Alberta', date: 'Feb 2026', url: 'https://www.coursera.org/account/accomplishments/specialization/031TKK6B9P0M' },
  { ico: '※', title: 'AI for Scientific Research Specialization',          org: 'LearnQuest',            date: 'Feb 2026', url: 'https://www.coursera.org/account/accomplishments/specialization/X5RAKDY7ROIQ' },
];

export const courses = [
  { t: 'Advanced Algorithms & Complexity',             o: 'UC San Diego',    url: 'https://www.coursera.org/account/accomplishments/verify/JNJHEB4COP6D' },
  { t: 'AWS Cloud Technical Essentials',               o: 'AWS',             url: 'https://www.coursera.org/account/accomplishments/verify/BGV632ZJDH0C' },
  { t: 'Architecting Solutions on AWS',                o: 'AWS',             url: 'https://www.coursera.org/account/accomplishments/verify/ELJV67XKHM6Q' },
  { t: 'Fundamentals of Java Programming',             o: 'Board Infinity',  url: 'https://www.coursera.org/account/accomplishments/verify/T174KJTGNVS5' },
  { t: 'Coding Interview Preparation',                 o: 'Meta',            url: 'https://www.coursera.org/account/accomplishments/verify/LHGCL59VISAB' },
  { t: 'Generative AI: Prompt Engineering Basics',     o: 'IBM',             url: 'https://www.coursera.org/account/accomplishments/verify/OM8TUDM9QEI4' },
  { t: 'Foundations of Cybersecurity',                  o: 'Google',          url: 'https://www.coursera.org/account/accomplishments/verify/AADJAT2RGKGV' },
];

export const links = {
  github: 'https://github.com/devansh698',
  linkedin: 'https://www.linkedin.com/in/devanshhanda',
  email: 'devanshhanda0001@gmail.com',
  phone: '+91 70827-90009',
  location: 'Yamuna Nagar, Haryana, India',
  portfolio: 'https://devansh-hg7s1gqie-3d-modelviewers-projects.vercel.app/',
};
