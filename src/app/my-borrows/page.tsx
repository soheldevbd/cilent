'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useUser } from '@/lib/use-user';
import { Loader } from '@/components/loader';
type Borrow = {
  _id: string;
  bookTitle: string;
  bookImage: string;
  borrowDate: string;
  returnDate: string;
  bookId: string;
};
export default function MyBorrows() {
  const { user, isPending } = useUser(),
    router = useRouter();
  const [rows, setRows] = useState<Borrow[]>([]),
    [loading, setLoading] = useState(true);
  async function load() {
    try {
      const d = await apiFetch<{ borrows: Borrow[] }>('/borrows');
      setRows(d.borrows);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not load borrows');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!isPending && !user) router.push('/login?callbackURL=/my-borrows');
    if (user) load();
  }, [user, isPending]);
  async function giveBack(id: string) {
    try {
      await apiFetch(`/borrows/${id}`, { method: 'DELETE' });
      setRows(r => r.filter(x => x._id !== id));
      toast.success('Book returned');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Return failed');
    }
  }
  if (loading) return <Loader />;
  return (
    <section className="section container">
      <h1 className="mb-7 text-4xl font-black">My Borrows</h1>
      {rows.length === 0 ? (
        <p className="card p-8 muted">You have not borrowed any books.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white">
          <table className="w-full min-w-162.5 text-left text-sm">
            <thead className="bg-[#edf3ed]">
              <tr>
                {['Book', 'Borrow date', 'Return date', 'Action'].map(x => (
                  <th className="p-4" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr className="border-t" key={r._id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={r.bookImage}
                        className="h-12 w-10 rounded object-cover"
                        alt=""
                      />
                      <b>{r.bookTitle}</b>
                    </div>
                  </td>
                  <td className="p-4">
                    {new Date(r.borrowDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {new Date(r.returnDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button className="btn" onClick={() => giveBack(r._id)}>
                      Return Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
