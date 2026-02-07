/* eslint-disable @next/next/no-img-element */
import React from 'react';

type BookSize = 'a4' | 'a5' | 'sm';

export interface BookCardProps {
  title: string;
  author: string;
  imageUrl?: string;
  size?: BookSize;
  className?: string;
}

const sizeClassMap: Record<BookSize, string> = {
  a4: 'w-56 h-80',
  a5: 'w-44 h-64',
  sm: 'w-36 h-52',
};

function BookCard({ title, author, imageUrl, size = 'a5', className = '' }: BookCardProps) {
  const sizeClass = sizeClassMap[size];

  return (
    <div className={`card bg-base-100 shadow-md overflow-hidden ${sizeClass} ${className}`}>
      <figure className="h-3/4 bg-base-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-base-content/60">
            No cover
          </div>
        )}
      </figure>
      <div className="card-body p-3 gap-2">
        <h3 className="font-bold text-sm line-clamp-2">{title}</h3>
        <div className="mt-auto text-right">
          <span className="text-xs text-base-content/60">{author}</span>
        </div>
      </div>
    </div>
  );
}

export default BookCard;