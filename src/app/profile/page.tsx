'use client';
import { authClient } from '@/lib/auth-client';
export default function Profile() {
  const { data } = authClient.useSession();
  return (
    <section className="section container max-w-xl">
      <div className="card p-8 text-center">
        <img
          src={data?.user.image || 'https://placehold.co/100'}
          className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
          alt=""
        />
        <h1 className="text-2xl font-black">{data?.user.name}</h1>
        <p className="muted">{data?.user.email}</p>
      </div>
    </section>
  );
}
