'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
export default function Register() {
  const [name, setName] = useState(''),
    [email, setEmail] = useState(''),
    [image, setImage] = useState(''),
    [password, setPassword] = useState(''),
    [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      password.length < 6
    ) {
      toast.error(
        'Password needs uppercase, lowercase and at least 6 characters.',
      );
      return;
    }
    setBusy(true);
    const r = await authClient.signUp.email({ name, email, password, image });
    setBusy(false);
    if (r.error) {
      toast.error(r.error.message || 'Registration failed');
      return;
    }
    toast.success('Account created. Please login.');
    router.push('/login');
  }
  return (
    <section className="container flex min-h-[70vh] items-center justify-center py-12">
      <form onSubmit={submit} className="card w-full max-w-md p-8">
        <h1 className="mb-6 text-3xl font-black">Create account</h1>
        {[
          ['Full name', name, setName, 'text'],
          ['Email', email, setEmail, 'email'],
          ['Photo URL', image, setImage, 'url'],
          ['Password', password, setPassword, 'password'],
        ].map(([label, value, set, type]) => (
          <label key={label as string} className="mb-4 block text-sm font-bold">
            {label as string}
            <input
              required={label !== 'Photo URL'}
              type={type as string}
              className="field mt-2"
              value={value as string}
              onChange={e => (set as (v: string) => void)(e.target.value)}
            />
          </label>
        ))}
        <p className="mb-4 text-xs muted">
          Password: 1 uppercase, 1 lowercase, minimum 6 characters.
        </p>
        <button disabled={busy} className="btn w-full">
          {busy ? 'Creating...' : 'Register'}
        </button>
        <p className="mt-5 text-center text-sm muted">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-[#245c45]">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
}
