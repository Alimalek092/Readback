import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ReadBack — Personal Knowledge Library for Readers',
    short_name: 'ReadBack',
    description:
      'Capture meaningful book ideas, organize your reading notes, and remember what you read using spaced repetition.',
    start_url: '/app',
    display: 'standalone',
    background_color: '#F8F6F0',
    theme_color: '#74866B',
    orientation: 'portrait',
    categories: ['education', 'productivity', 'books'],
  };
}
