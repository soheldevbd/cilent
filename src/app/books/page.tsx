'use client';
import { useEffect, useState } from 'react';
import { BookCard, Book } from '@/components/book-card';
import { Loader } from '@/components/loader';
import { toast } from 'sonner';
export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]),
    [loading, setLoading] = useState(true),
    [search, setSearch] = useState(''),
    [category, setCategory] = useState('All');
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`)
      .then(r => r.json())
      .then(d => setBooks(d.books || []))
      .catch(() => toast.error('Could not load books'))
      .finally(() => setLoading(false));
  }, []);
  const filtered = books.filter(
    b =>
      (category === 'All' || b.category === category) &&
      `${b.title} ${b.author}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <section className="section container">
      <h1 className="mb-2 text-4xl font-black">Explore the library</h1>
      <p className="mb-7 muted">Find a book for your next quiet afternoon.</p>
      <div className="mb-8 grid gap-3 md:grid-cols-[1fr_220px]">
        <input
          className="field"
          placeholder="Search title or author..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="field"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {['All', 'Fiction', 'Science', 'History', 'Kids', 'Others'].map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <Loader />
      ) : filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(b => (
            <BookCard key={b._id} book={b} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-white p-8 text-center muted">
          No matching books found.
        </p>
      )}
    </section>
  );
}
