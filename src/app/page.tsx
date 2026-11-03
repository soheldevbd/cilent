'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useEffect, useState } from 'react';

import { BookCard, Book } from '@/components/book-card';
import { Loader } from '@/components/loader';
import { toast } from 'sonner';

// @ts-ignore Swiper's CSS is loaded by the Next.js bundler.
import 'swiper/css';

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      toast.error('API URL is not configured');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    fetch(`${apiUrl}/books?limit=6`, {
      signal: controller.signal,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        return response.json();
      })
      .then(data => {
        setBooks(data.books || []);
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          toast.error('Could not load new arrivals');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <>
      <style jsx global>{`
        .home-swiper .swiper-pagination {
          position: absolute;
          bottom: 8px;
          left: 0;
          width: 100%;
          text-align: center;
          z-index: 10;
        }

        .home-swiper .swiper-pagination-bullet {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin: 0 4px;
          border-radius: 9999px;
          background: #fff;
          opacity: 0.5;
          cursor: pointer;
        }

        .home-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>

      <section className="container pt-6">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          loop
          className="home-swiper overflow-hidden rounded-3xl"
        >
          {slides.map(slide => (
            <SwiperSlide key={slide.title}>
              <div
                className="relative flex min-h-107.5 items-center bg-cover bg-center px-8 py-16 md:px-16"
                style={{
                  backgroundImage: `linear-gradient(90deg,rgba(13,34,24,.88),rgba(13,34,24,.22)),url(${slide.img})`,
                }}
              >
                <div className="max-w-xl text-white">
                  <p className="mb-4 font-bold uppercase tracking-[.2em] text-[#c4e0c9]">
                    {slide.tag}
                  </p>

                  <h1 className="mb-5 text-4xl font-black leading-tight md:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="mb-7 max-w-lg text-white/85">{slide.desc}</p>

                  <Link className="btn bg-white text-[#245c45]!" href="/books">
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
        ) : books.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map(book => (
              <BookCard key={book._id} book={book} />
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
              (item, index) => (
                <div className="card p-5" key={item}>
                  <div className="mb-3 text-2xl font-black text-[#245c45]">
                    0{index + 1}
                  </div>
                  <h3 className="font-bold">{item}</h3>
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
