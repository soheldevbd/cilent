'use client';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useEffect, useState } from 'react';
import { BookCard, Book } from '@/components/book-card';
import { Loader } from '@/components/loader';
import { toast } from 'sonner';
const slides = [
  {
    tag: 'A world between pages',
    title: 'Find your next favourite story.',
    desc: 'Explore a growing collection of books shared by readers like you.',
    img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600',
  },
  {
    tag: 'Read. Share. Repeat.',
    title: 'Good books deserve more readers.',
    desc: 'Borrow a book, enjoy the journey, then pass it along.',
    img: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1600',
  },
  {
    tag: 'Your reading corner',
    title: 'Make room for new ideas.',
    desc: 'From science to fiction, there is always something waiting.',
    img: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1600',
  },
];
export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books?limit=6`)
      .then(r => r.json())
      .then(d => setBooks(d.books || []))
      .catch(() => toast.error('Could not load new arrivals'))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <section className="container pt-6">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="overflow-hidden rounded-3xl"
        >
          {slides.map(s => (
            <SwiperSlide key={s.title}>
              <div
                className="relative flex min-h-[430px] items-center bg-cover bg-center px-8 py-16 md:px-16"
                style={{
                  backgroundImage: `linear-gradient(90deg,rgba(13,34,24,.88),rgba(13,34,24,.22)),url(${s.img})`,
                }}
              >
                <div className="max-w-xl text-white">
                  <p className="mb-4 font-bold uppercase tracking-[.2em] text-[#c4e0c9]">
                    {s.tag}
                  </p>
                  <h1 className="mb-5 text-4xl font-black leading-tight md:text-6xl">
                    {s.title}
                  </h1>
                  <p className="mb-7 max-w-lg text-white/85">{s.desc}</p>
                  <Link className="btn bg-white !text-[#245c45]" href="/books">
                    Browse Books
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      <section className="section container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-bold uppercase tracking-widest text-[#66836e]">
              Fresh on the shelf
            </p>
            <h2 className="text-3xl font-black">New Arrivals</h2>
          </div>
          <Link href="/books" className="font-bold text-[#245c45]">
            See All Books →
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : books.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map(b => (
              <BookCard key={b._id} book={b} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-white p-8 text-center muted">
            No books yet. Be the first to add one!
          </p>
        )}
      </section>
      <section className="section bg-[#edf3ed]">
        <div className="container grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-2 font-bold uppercase tracking-widest text-[#66836e]">
              Simple by design
            </p>
            <h2 className="mb-4 text-3xl font-black">How borrowing works</h2>
            <p className="muted">
              Find a title, check availability and borrow it for a little while.
              Return it when you are done so another reader can enjoy it.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {['Browse books', 'Borrow a copy', 'Return & repeat'].map(
              (x, i) => (
                <div className="card p-5" key={x}>
                  <div className="mb-3 text-2xl font-black text-[#245c45]">
                    0{i + 1}
                  </div>
                  <h3 className="font-bold">{x}</h3>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
      <section className="section container text-center">
        <p className="mb-2 font-bold uppercase tracking-widest text-[#66836e]">
          A community of readers
        </p>
        <h2 className="mb-4 text-3xl font-black">
          Every book opens a new door.
        </h2>
        <p className="mx-auto mb-6 max-w-xl muted">
          Share the books you love and help someone discover their next great
          read.
        </p>
        <Link className="btn" href="/add-book">
          Share a Book
        </Link>
      </section>
    </>
  );
}
