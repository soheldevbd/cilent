'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { Book } from '@/components/book-card';
import { Loader } from '@/components/loader';
import { useUser } from '@/lib/use-user';
export default function BookDetails() {
  const { id } = useParams<{ id: string }>(),
    router = useRouter(),
    { user } = useUser();
  const [book, setBook] = useState<Book | null>(null),
    [loading, setLoading] = useState(true),
    [modal, setModal] = useState(false),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Book not found');
        return r.json();
      })
      .then(d => setBook(d.book))
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id]);
  async function borrow() {
    if (!user) {
      router.push(`/login?callbackURL=/books/${id}`);
      return;
    }
    setBusy(true);
    try {
      await apiFetch('/borrows', {
        method: 'POST',
        body: JSON.stringify({ bookId: id }),
      });
      toast.success('Book borrowed successfully');
      setModal(false);
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`);
      setBook((await r.json()).book);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Borrow failed');
    } finally {
      setBusy(false);
    }
  }
  if (loading) return <Loader />;
  if (!book) return <div className="container py-20">Book not found.</div>;
  return (
    <section className="section container">
      <div className="grid gap-9 md:grid-cols-[.8fr_1.2fr]">
        <img
          src={book.image}
          alt={book.title}
          className="w-full rounded-2xl object-cover md:max-h-140"
        />
        <div>
          <span className="rounded-full bg-[#eaf2ec] px-3 py-1 text-sm font-bold text-[#245c45]">
            {book.category}
          </span>
          <h1 className="my-4 text-4xl font-black">{book.title}</h1>
          <p className="mb-5 text-lg muted">By {book.author}</p>
          <p className="mb-6 leading-8">
            {book.description || book.shortDescription}
          </p>
          <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl bg-white p-4">
            <div>
              <p className="text-sm muted">Available copies</p>
              <b>
                {book.availableCopies} / {book.totalCopies}
              </b>
            </div>
            <div>
              <p className="text-sm muted">Added by</p>
              <b>{book.addedByName}</b>
            </div>
          </div>
          <button
            disabled={book.availableCopies < 1}
            className="btn"
            onClick={() => setModal(true)}
          >
            {book.availableCopies < 1 ? 'Not Available' : 'Borrow This Book'}
          </button>
        </div>
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="mb-3 text-2xl font-black">Confirm borrowing</h2>
            <p className="mb-2 muted">Borrowing as</p>
            <p className="font-bold">{user?.name}</p>
            <p className="mb-6 muted">{user?.email}</p>
            <div className="flex gap-3">
              <button className="btn flex-1" disabled={busy} onClick={borrow}>
                {busy ? 'Please wait...' : 'Confirm Borrow'}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
