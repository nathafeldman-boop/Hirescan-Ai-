import { MetadataRoute } from 'next';

const BASE_URL = 'https://ursecret.vercel.app';

const QUIZ_SLUGS = [
  'infidelite', 'adopte', 'amoureux', 'vrais-amis', 'orientation',
  'narcissique', 'mon-ex', 'manipule', 'rompre', 'jaloux',
  'relation-toxique', 'crush', 'burnout', 'depression', 'vrai-amour',
  'style-attachement', 'langages-amour', 'gaslight',
];

const GUIDE_SLUGS = [
  'style-attachement', 'langages-amour', 'gaslight', 'burnout',
  'depression', 'narcissique', 'infidelite', 'manipule', 'relation-toxique',
];

const DUO_SLUGS = [
  'duo-communication', 'duo-compatibilite', 'duo-investissement',
  'duo-resilience', 'duo-amour',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE_URL,               lastModified: now, changeFrequency: 'daily',  priority: 1    },
    { url: `${BASE_URL}/quizzes`,  lastModified: now, changeFrequency: 'daily',  priority: 0.95 },
    { url: `${BASE_URL}/duo`,       lastModified: now, changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/tests`,    lastModified: now, changeFrequency: 'weekly', priority: 0.88 },
    ...QUIZ_SLUGS.map((slug) => ({
      url: `${BASE_URL}/quiz/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...DUO_SLUGS.map((slug) => ({
      url: `${BASE_URL}/duo/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...GUIDE_SLUGS.map((slug) => ({
      url: `${BASE_URL}/tests/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    { url: `${BASE_URL}/feed.xml`,  lastModified: now, changeFrequency: 'daily', priority: 0.5 },
    { url: `${BASE_URL}/atom.xml`,  lastModified: now, changeFrequency: 'daily', priority: 0.5 },
  ];
}
