import { OpenLibrarySearchResult } from './types';

export interface FormattedBookResult {
  title: string;
  author: string;
  coverUrl?: string;
  publicationYear?: number;
  isbn?: string;
  category: string;
  key: string;
}

export async function searchOpenLibrary(query: string): Promise<FormattedBookResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      query.trim()
    )}&limit=8`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'ReadBackSaaS/1.0 (contact@readback.app)',
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`Open Library API responded with status: ${res.status}`);
      return [];
    }

    const data = await res.json();
    const docs: OpenLibrarySearchResult[] = data.docs || [];

    return docs.map((doc) => {
      const author = doc.author_name ? doc.author_name[0] : 'Unknown Author';
      const coverUrl = doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : undefined;
      const category =
        doc.subject && doc.subject.length > 0
          ? doc.subject[0].replace(/^[a-z]/, (c) => c.toUpperCase())
          : 'General';

      return {
        key: doc.key,
        title: doc.title,
        author,
        coverUrl,
        publicationYear: doc.first_publish_year,
        isbn: doc.isbn ? doc.isbn[0] : undefined,
        category,
      };
    });
  } catch (error) {
    console.error('Failed to fetch from Open Library:', error);
    return [];
  }
}
