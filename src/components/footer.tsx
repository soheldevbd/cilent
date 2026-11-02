import Link from 'next/link';
import { BookOpen, Mail, MapPin } from 'lucide-react';
export function Footer() {
  return (
    <footer className="mt-16 bg-[#182d23] py-12 text-white">
      <div className="container grid gap-8 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xl font-black">
            <BookOpen /> BookNook
          </div>
          <p className="max-w-sm text-sm text-white/70">
            A little corner for curious minds. Discover stories, share knowledge
            and keep reading.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-bold">Explore</h3>
          <div className="grid gap-2 text-sm text-white/75">
            <Link href="/">Home</Link>
            <Link href="/books">All Books</Link>
            <Link href="/my-borrows">My Borrows</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-bold">Contact</h3>
          <p className="mb-2 flex items-center gap-2 text-sm text-white/75">
            <Mail size={16} /> hello@booknook.example
          </p>
          <p className="flex items-center gap-2 text-sm text-white/75">
            <MapPin size={16} /> Bangladesh
          </p>
        </div>
      </div>
      <div className="container mt-9 border-t border-white/15 pt-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} BookNook. Made for readers.
      </div>
    </footer>
  );
}
