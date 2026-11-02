'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { BookOpen, ChevronDown, LogOut, Menu, X } from 'lucide-react';

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const user = session?.user;
  const links = [
    { href: '/', label: 'Home' },
    { href: '/books', label: 'All Books' },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-[#e8ebe5] bg-white/95 backdrop-blur">
      <div className="container flex min-h-[72px] items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-black text-[#245c45]"
        >
          <BookOpen /> BookNook
        </Link>
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          className={`${open ? 'flex' : 'hidden'} absolute left-0 top-[72px] w-full flex-col gap-4 border-b bg-white p-5 md:static md:flex md:w-auto md:flex-row md:items-center md:border-0 md:p-0`}
        >
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-semibold hover:text-[#245c45]"
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <>
              <Link href="/add-book">Add Book</Link>
              <Link href="/my-books">My Books</Link>
              <Link href="/my-borrows">My Borrows</Link>
            </>
          )}
          {!isPending && !user && (
            <>
              <Link className="btn btn-outline" href="/login">
                Login
              </Link>
              <Link className="btn" href="/register">
                Register
              </Link>
            </>
          )}
          {user && (
            <div className="relative">
              <button
                onClick={() => setMenu(!menu)}
                className="flex items-center gap-2 rounded-full border px-3 py-2"
              >
                <img
                  src={user.image || 'https://placehold.co/36x36'}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="max-w-28 truncate">{user.name}</span>
                <ChevronDown size={15} />
              </button>
              {menu && (
                <div className="absolute right-0 top-12 z-50 min-w-44 rounded-xl border bg-white p-2 shadow-xl">
                  <p className="px-3 py-2 text-sm muted">{user.email}</p>
                  <Link
                    className="block rounded-lg px-3 py-2 hover:bg-stone-100"
                    href="/profile"
                  >
                    My Profile
                  </Link>
                  <button
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-stone-100"
                    onClick={async () => {
                      await authClient.signOut();
                      location.href = '/';
                    }}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
