'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useUser } from '@/lib/use-user';
import { Book } from '@/components/book-card';
import { Loader } from '@/components/loader';
import { useRouter } from 'next/navigation';
export default function MyBooks() {
  const { user, isPending } = useUser(),
    router = useRouter();
  const [books, setBooks] = useState<Book[]>([]),
    [loading, setLoading] = useState(true),
    [editing, setEditing] = useState<Book | null>(null);
  async function load() {
    try {
      const d = await apiFetch<{ books: Book[] }>('/books?mine=true');
      setBooks(d.books);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not load your books');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!isPending && !user) router.push('/login?callbackURL=/my-books');
    if (user) load();
  }, [user, isPending]);
  async function remove(id: string) {
    if (!window.confirm('Delete this book permanently?')) return;
    try {
      await apiFetch(`/books/${id}`, { method: 'DELETE' });
      setBooks(b => b.filter(x => x._id !== id));
      toast.success('Book deleted');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    }
  }
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const f = new FormData(e.currentTarget);
    const body = Object.fromEntries(f.entries());
    try {
      await apiFetch(`/books/${editing._id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      toast.success('Book updated');
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed');
    }
  }
  if (loading) return <Loader />;
  return (
    <section className="section container">
      <h1 className="mb-7 text-4xl font-black">My Books</h1>
      {books.length === 0 ? (
        <p className="card p-8 muted">
          You have not added any books yet.{' '}
          <Link className="font-bold text-[#245c45]" href="/add-book">
            Add your first book
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-4">
          {books.map(b => (
            <div
              key={b._id}
              className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
            >
              <img
                src={b.image}
                className="h-24 w-20 rounded-lg object-cover"
                alt=""
              />
              <div className="flex-1">
                <h2 className="font-bold">{b.title}</h2>
                <p className="text-sm muted">
                  {b.author} · {b.category} · {b.availableCopies}/
                  {b.totalCopies} available
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-outline"
                  onClick={() => setEditing(b)}
                >
                  Edit
                </button>
                <button
                  className="btn bg-red-700"
                  onClick={() => remove(b._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={save}
            className="w-full max-w-lg rounded-2xl bg-white p-6"
          >
            <h2 className="mb-4 text-2xl font-black">Edit book</h2>
            {(
              [
                'title',
                'author',
                'image',
                'shortDescription',
                'description',
                'totalCopies',
              ] as const
            ).map(k => (
              <input
                key={k}
                name={k}
                defaultValue={String(editing[k] ?? '')}
                className="field mb-3"
                placeholder={k}
              />
            ))}
            <select
              name="category"
              defaultValue={editing.category}
              className="field mb-4"
            >
              {['Fiction', 'Science', 'History', 'Kids', 'Others'].map(x => (
                <option key={x}>{x}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button className="btn">Save changes</button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
