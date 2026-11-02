'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
export default function Login() {
  const [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [busy, setBusy] = useState(false);
  const params = useSearchParams(),
    router = useRouter();
  const callback = params.get('callbackURL') || '/';
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await authClient.signIn.email({ email, password });
    setBusy(false);
    if (r.error) {
      toast.error(r.error.message || 'Login failed');
      return;
    }
    toast.success('Welcome back!');
    router.push(callback);
  }
  return (
    <section className="container flex min-h-[70vh] items-center justify-center py-12">
      <form onSubmit={submit} className="card w-full max-w-md p-8">
        <p className="mb-2 font-bold uppercase tracking-widest text-[#66836e]">
          Welcome back
        </p>
        <h1 className="mb-6 text-3xl font-black">Login to BookNook</h1>
        <label className="mb-2 block text-sm font-bold">Email</label>
        <input
          required
          type="email"
          className="field mb-4"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label className="mb-2 block text-sm font-bold">Password</label>
        <input
          required
          type="password"
          className="field mb-5"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button disabled={busy} className="btn w-full">
          {busy ? 'Logging in...' : 'Login'}
        </button>
        <button
          type="button"
          className="btn btn-outline mt-3 w-full"
          onClick={async () => {
            const r = await authClient.signIn.social({
              provider: 'google',
              callbackURL: callback,
            });
            if (r.error) toast.error(r.error.message || 'Google login failed');
          }}
        >
          Continue with Google
        </button>
        <p className="mt-5 text-center text-sm muted">
          New here?{' '}
          <Link className="font-bold text-[#245c45]" href="/register">
            Create an account
          </Link>
        </p>
      </form>
    </section>
  );
}
