import { MetadataRoute } from 'next';

const BASE_URL = 'https://ursecret.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE_URL,                              lastModified: now, changeFrequency: 'daily',   priority: 1    },
    { url: `${BASE_URL}/quizzes`,                 lastModified: now, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${BASE_URL}/quiz/infidelite`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${BASE_URL}/quiz/adopte`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${BASE_URL}/quiz/amoureux`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${BASE_URL}/quiz/vrais-amis`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${BASE_URL}/quiz/orientation`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${BASE_URL}/feed.xml`,                lastModified: now, changeFrequency: 'daily',   priority: 0.5  },
    { url: `${BASE_URL}/atom.xml`,                lastModified: now, changeFrequency: 'daily',   priority: 0.5  },
  ];
}
