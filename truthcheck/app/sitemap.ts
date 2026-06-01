import { MetadataRoute } from 'next';

const BASE_URL = 'https://ursecret.vercel.app';

const QUIZ_SLUGS = [
  'infidelite', 'adopte', 'amoureux', 'vrais-amis', 'orientation',
  'narcissique', 'mon-ex', 'manipule', 'rompre', 'jaloux',
  'relation-toxique', 'crush', 'burnout', 'depression', 'vrai-amour',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE_URL,          lastModified: now, changeFrequency: 'daily',  priority: 1    },
    { url: `${BASE_URL}/quizzes`, lastModified: now, changeFrequency: 'daily',  priority: 0.95 },
    ...QUIZ_SLUGS.map((slug) => ({
      url: `${BASE_URL}/quiz/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    { url: `${BASE_URL}/feed.xml`,  lastModified: now, changeFrequency: 'daily', priority: 0.5 },
    { url: `${BASE_URL}/atom.xml`,  lastModified: now, changeFrequency: 'daily', priority: 0.5 },
  ];
}
