import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="container flex min-h-[65vh] flex-col items-center justify-center text-center">
      <p className="text-7xl font-black text-[#245c45]">404</p>
      <h1 className="my-4 text-3xl font-black">
        This page wandered off the shelf.
      </h1>
      <p className="mb-6 muted">The page you are looking for does not exist.</p>
      <Link className="btn" href="/">
        Back to Home
      </Link>
    </section>
  );
}
