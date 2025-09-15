import { NextRequest, NextResponse } from 'next/server';

// Optional: Gemini classification using Google Generative AI
let googleClient: any = null;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyA8usl5r7fzAA3RQ92oWF9lJMBDEDcnzCc';
async function classifyCategoryWithGemini(text: string): Promise<string | null> {
  try {
    if (!googleClient) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      googleClient = new GoogleGenerativeAI(GOOGLE_API_KEY);
    }
    const model = googleClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Classify the following news headline+summary into ONE of these categories exactly: Finance, Tech, Politics, Sports, World News, Business, Arts & Entertainment, Lifestyle. Respond with category name only.\n\nText:\n${text}`;
    const res = await model.generateContent(prompt);
    const out = (res?.response?.text?.() || '').trim();
    if (!out) return null;
    const cleaned = out.replace(/[^A-Za-z &]/g, '').trim();
    return cleaned || null;
  } catch {
    return null;
  }
}

const RAPID_API_KEY = process.env.RAPIDAPI_KEY || '93e69d4612mshb9882c64196bebap186e1ajsn4e3c4ca3b804';
const RAPID_API_HOST = 'newsnow.p.rapidapi.com';
const RAPID_API_URL = 'https://newsnow.p.rapidapi.com/newsv2_top_news';

// Simple category inference fallback if Gemini unavailable
function naiveCategoryFromText(text: string): string {
  const t = text.toLowerCase();
  if (/(stock|market|fed|interest|bank|finance|econom|ipo|inflation)/.test(t)) return 'Finance';
  if (/(tech|ai|quantum|software|startup|chip|semiconductor|computer|robot)/.test(t)) return 'Tech';
  if (/(election|policy|parliament|senate|president|government|diplomacy)/.test(t)) return 'Politics';
  if (/(olympic|football|basketball|soccer|tennis|sport)/.test(t)) return 'Sports';
  if (/(climate|world|international|summit|war|peace|global)/.test(t)) return 'World News';
  if (/(movie|music|celebrity|entertainment|theater|art)/.test(t)) return 'Arts & Entertainment';
  if (/(health|medicine|cancer|diet|fitness|lifestyle|travel|food|fashion)/.test(t)) return 'Lifestyle';
  return 'General';
}

async function fetchRapidNews(payload: any) {
  const res = await fetch(RAPID_API_URL, {
    method: 'POST',
    headers: {
      'x-rapidapi-key': RAPID_API_KEY,
      'x-rapidapi-host': RAPID_API_HOST,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RapidAPI error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    // Lazy-load Firebase only for POST to avoid import side-effects on GET
    const { firestore } = await import('../../../../lib/firebase');
    const { collection, addDoc, getDocs, query, where, serverTimestamp } = await import('firebase/firestore');
    const body = await req.json().catch(() => ({}));
    const { location = 'us', language = 'en', page = 1, query: searchQuery, from_date, to_date } = body || {};

    const data = await fetchRapidNews({
      location,
      language,
      page,
      time_bounded: !!(from_date || to_date),
      from_date: from_date || '01/01/2024',
      to_date: to_date || '12/31/2025',
      query: searchQuery
    });

    const articles: any[] = data?.news || [];

    const articlesRef = collection(firestore, 'articles');

    const results: any[] = [];
    for (const item of articles) {
      const title: string = item.title || '';
      const shortDesc: string = item.short_description || '';
      const url: string = item.url || '';
      const imageUrl: string = item.top_image || '/api/placeholder/800/500';
      const source: string = item.source || 'Unknown';
      const published: string = item.publish_date || new Date().toISOString();

      // Skip if doc with same title already exists
      const existingQ = query(articlesRef, where('title', '==', title));
      const existingSnap = await getDocs(existingQ);
      if (!existingSnap.empty) {
        continue;
      }

      // Category via Gemini, fallback to naive
      const geminiCat = await classifyCategoryWithGemini(`${title}. ${shortDesc}`);
      const category = geminiCat || naiveCategoryFromText(`${title} ${shortDesc}`);

      const docToSave = {
        title,
        content: shortDesc,
        excerpt: shortDesc,
        author: source,
        publishDate: published,
        category,
        imageUrl,
        tags: [],
        viewCount: 0,
        readTime: '5 min read',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        featured: false,
        status: 'published',
        sourceUrl: url
      };
      const saved = await addDoc(articlesRef, docToSave);
      results.push({ id: saved.id, ...docToSave });
    }

    return NextResponse.json({ added: results.length, items: results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to sync news' }, { status: 500 });
  }
}

export async function GET() {
  // No-op on GET to avoid failures during initial page load
  return NextResponse.json({ status: 'ok' });
}
// Ensure Node.js runtime (not Edge) for compatibility with Firebase SDK and external fetch
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


