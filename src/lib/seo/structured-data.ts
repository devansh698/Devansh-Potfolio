import { courses, education, profile, projects, roles, skills, specializations, ticker, type Project } from '@/lib/data';
import { CONTENT_UPDATED_AT, SITE_URL, absoluteUrl, projectPath, projectDescription, site } from '@/lib/site';

/** schema.org JSON-LD. Nodes reference each other by `@id` so crawlers merge them into one entity graph. */
type JsonLdNode = Record<string, unknown>;

export interface JsonLdGraph {
  '@context': 'https://schema.org';
  '@graph': JsonLdNode[];
}

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const EMPLOYER_ID = `${SITE_URL}/#employer`;
const OG_IMAGE = absoluteUrl('/opengraph-image');

const currentRole = roles[0];

function personNode(): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    givenName: profile.firstName,
    familyName: profile.lastName,
    url: SITE_URL,
    image: OG_IMAGE,
    email: `mailto:${profile.email}`,
    jobTitle: profile.role,
    description: profile.intro,
    worksFor: { '@id': EMPLOYER_ID },
    address: { '@type': 'PostalAddress', addressRegion: 'Haryana', addressCountry: 'IN' },
    alumniOf: education.map((e) => ({ '@type': 'EducationalOrganization', name: e.org })),
    knowsAbout: Array.from(new Set([...skills.map((s) => s.name), ...ticker])),
    knowsLanguage: ['en', 'hi'],
    sameAs: [profile.github, profile.linkedin],
    hasOccupation: {
      '@type': 'Occupation',
      name: currentRole.title,
      occupationLocation: { '@type': 'Country', name: 'India' },
      skills: currentRole.stack.join(', '),
    },
    hasCredential: [...specializations, ...courses].map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.title,
      credentialCategory: 'certificate',
      url: c.url,
      recognizedBy: { '@type': 'Organization', name: c.org },
      ...(c.date ? { dateCreated: c.date } : {}),
    })),
  };
}

function employerNode(): JsonLdNode {
  return { '@type': 'Organization', '@id': EMPLOYER_ID, name: profile.company };
}

function websiteNode(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: site.name,
    description: site.description,
    inLanguage: site.language,
    publisher: { '@id': PERSON_ID },
    author: { '@id': PERSON_ID },
  };
}

function projectNode(project: Project): JsonLdNode {
  const url = absoluteUrl(projectPath(project));
  return {
    '@type': project.repo ? 'SoftwareSourceCode' : 'CreativeWork',
    '@id': `${url}#project`,
    name: project.title,
    headline: `${project.title} — ${project.kind}`,
    description: project.desc,
    abstract: project.result,
    url,
    image: `${url}/opengraph-image`,
    dateCreated: project.year,
    keywords: project.stack.join(', '),
    genre: project.kind,
    inLanguage: site.language,
    author: { '@id': PERSON_ID },
    creator: { '@id': PERSON_ID },
    ...(project.repo ? { codeRepository: project.repo, sameAs: project.repo } : {}),
  };
}

function projectListNode(): JsonLdNode {
  return {
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#projects`,
    name: `Selected work by ${profile.name}`,
    numberOfItems: projects.length,
    itemListElement: projects.map((project, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(projectPath(project)),
      name: project.title,
    })),
  };
}

export function homeJsonLd(): JsonLdGraph {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode(),
      personNode(),
      employerNode(),
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        name: site.title,
        description: site.description,
        inLanguage: site.language,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': PERSON_ID },
        mainEntity: { '@id': PERSON_ID },
        primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE, width: 1200, height: 630 },
        dateModified: CONTENT_UPDATED_AT,
        hasPart: { '@id': `${SITE_URL}/#projects` },
      },
      projectListNode(),
    ],
  };
}

export function projectJsonLd(project: Project): JsonLdGraph {
  const url = absoluteUrl(projectPath(project));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode(),
      { '@type': 'Person', '@id': PERSON_ID, name: profile.name, url: SITE_URL, sameAs: [profile.github, profile.linkedin] },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: `${project.title} — ${project.kind}`,
        description: projectDescription(project),
        inLanguage: site.language,
        isPartOf: { '@id': WEBSITE_ID },
        author: { '@id': PERSON_ID },
        mainEntity: { '@id': `${url}#project` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        dateModified: CONTENT_UPDATED_AT,
      },
      projectNode(project),
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: profile.name, item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Work', item: `${SITE_URL}/#work` },
          { '@type': 'ListItem', position: 3, name: project.title, item: url },
        ],
      },
    ],
  };
}
