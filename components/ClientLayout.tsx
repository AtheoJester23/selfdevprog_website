'use client';

import dynamic from 'next/dynamic';
import { Session } from 'next-auth';

const Navbar = dynamic(() => import('./Navbar'), {
  ssr: false,
});

export default function ClientLayout({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar isSession={session} />
      {children}
    </main>
  );
}
