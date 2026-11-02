'use client';
import Link from 'next/link';
import { imageFallback } from '@/lib/api';
export type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  shortDescription: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  addedAt: string;
  addedByName: string;
  addedByEmail: string;
};
export function BookCard({ book }: { book: Book }) {
  return (
    <article className="card flex h-full flex-col">
      <img
        src={book.image || imageFallback}
        alt={book.title}
        className="h-52 w-full object-cover"
        onError={e => {
          e.currentTarget.src = imageFallback;
        }}
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-[#eaf2ec] px-3 py-1 text-xs font-bold text-[#245c45]">
            {book.category}
          </span>
          <span className="text-xs muted">
            {book.availableCopies} available
          </span>
        </div>
        <h3 className="mb-1 text-lg font-bold">{book.title}</h3>
        <p className="mb-3 text-sm muted">by {book.author}</p>
        <p className="mb-5 line-clamp-2 text-sm muted">
          {book.shortDescription}
        </p>
        <Link className="btn mt-auto w-full" href={`/books/${book._id}`}>
          View Details
        </Link>
      </div>
    </article>
  );
}
