import { NextResponse } from 'next/server';

const BASE = 'https://ursecret.site';
const INDEXNOW_KEY = 'ursecretidx2025';

const ALL_URLS = [
  BASE,
  `${BASE}/quizzes`,
  `${BASE}/quiz/infidelite`,
  `${BASE}/quiz/adopte`,
  `${BASE}/quiz/amoureux`,
  `${BASE}/quiz/vrais-amis`,
  `${BASE}/quiz/orientation`,
  `${BASE}/quiz/narcissique`,
  `${BASE}/quiz/mon-ex`,
  `${BASE}/quiz/manipule`,
  `${BASE}/quiz/rompre`,
  `${BASE}/quiz/jaloux`,
  `${BASE}/quiz/relation-toxique`,
  `${BASE}/quiz/crush`,
  `${BASE}/quiz/burnout`,
  `${BASE}/quiz/depression`,
  `${BASE}/quiz/vrai-amour`,
];

export async function GET() {
  const results: Record<string, string> = {};

  // 1. Ping Google sitemap
  try {
    const googleRes = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(`${BASE}/sitemap.xml`)}`,
      { method: 'GET' }
    );
    results.google_sitemap = `${googleRes.status}`;
  } catch {
    results.google_sitemap = 'error';
  }

  // 2. Ping Bing sitemap
  try {
    const bingRes = await fetch(
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(`${BASE}/sitemap.xml`)}`,
      { method: 'GET' }
    );
    results.bing_sitemap = `${bingRes.status}`;
  } catch {
    results.bing_sitemap = 'error';
  }

  // 3. IndexNow — submits all URLs to Bing/Yandex/others instantly
  try {
    const indexNowRes = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'ursecret.site',
        key: INDEXNOW_KEY,
        keyLocation: `${BASE}/${INDEXNOW_KEY}.txt`,
        urlList: ALL_URLS,
      }),
    });
    results.indexnow = `${indexNowRes.status}`;
  } catch {
    results.indexnow = 'error';
  }

  // 4. Ping PubSubHubbub for RSS feed (near real-time for subscribed crawlers)
  try {
    const hubBody = new URLSearchParams({
      'hub.mode': 'publish',
      'hub.url': `${BASE}/feed.xml`,
    });
    const hubRes = await fetch('https://pubsubhubbub.appspot.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: hubBody.toString(),
    });
    results.pubsubhubbub = `${hubRes.status}`;
  } catch {
    results.pubsubhubbub = 'error';
  }

  // 5. Ping Bing IndexNow directly (belt and suspenders)
  try {
    const bingIndexNow = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'ursecret.site',
        key: INDEXNOW_KEY,
        keyLocation: `${BASE}/${INDEXNOW_KEY}.txt`,
        urlList: ALL_URLS,
      }),
    });
    results.bing_indexnow = `${bingIndexNow.status}`;
  } catch {
    results.bing_indexnow = 'error';
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    urls_submitted: ALL_URLS.length,
    results,
  });
}
