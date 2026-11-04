'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';

interface BookCoverProps {
  title: string;
  author: string;
  coverUrl?: string;
  className?: string;
  aspectRatio?: 'portrait' | 'square';
}

export const BookCover: React.FC<BookCoverProps> = ({
  title,
  author,
  coverUrl,
  className = '',
  aspectRatio = 'portrait',
}) => {
  const [imageError, setImageError] = React.useState(false);

  // Generate a soft deterministic hue for books without cover image
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorVariants = [
    { bg: 'bg-[#E3DEC3]', text: 'text-[#484232]', border: 'border-[#CEC6A8]' },
    { bg: 'bg-[#DDE5D6]', text: 'text-[#3E4F37]', border: 'border-[#C6D3BC]' },
    { bg: 'bg-[#E5DFD7]', text: 'text-[#50443B]', border: 'border-[#D0C5B8]' },
    { bg: 'bg-[#DFE3E6]', text: 'text-[#3B4852]', border: 'border-[#C4CDD3]' },
    { bg: 'bg-[#EAE4DC]', text: 'text-[#524538]', border: 'border-[#D7CDC0]' },
  ];
  const variant = colorVariants[hash % colorVariants.length];

  const aspectClass = aspectRatio === 'portrait' ? 'aspect-[2/3]' : 'aspect-square';

  if (coverUrl && !imageError) {
    return (
      <div
        className={`relative overflow-hidden rounded-md shadow-sm border border-[#E9E5DC] ${aspectClass} ${className} bg-[#F1EEE6]`}
      >
        <img
          src={coverUrl}
          alt={`Cover of ${title}`}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-md border p-3 flex flex-col justify-between select-none shadow-sm ${variant.bg} ${variant.border} ${aspectClass} ${className}`}
    >
      <div className="flex items-center justify-between opacity-60">
        <BookOpen className={`w-3.5 h-3.5 ${variant.text}`} />
        <span className={`text-[10px] uppercase font-mono tracking-wider ${variant.text}`}>
          ReadBack
        </span>
      </div>

      <div className="my-auto py-2">
        <h4
          className={`font-serif text-sm font-semibold leading-tight line-clamp-3 mb-1 ${variant.text}`}
        >
          {title}
        </h4>
        <p className={`text-xs opacity-80 line-clamp-1 ${variant.text}`}>
          {author}
        </p>
      </div>

      <div className="w-full h-0.5 bg-current opacity-20 rounded-full" />
    </div>
  );
};
