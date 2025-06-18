'use client';

import dynamic from 'next/dynamic';
import { Session } from 'next-auth';
import { motion } from "framer-motion"
import { useEffect, useState } from 'react';

const Navbar = dynamic(() => import('./Navbar'),{
  ssr: false,
});

export default function ClientLayout({ session, children,} : { session: Session | null; children: React.ReactNode;}) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  
  return (
    <main>
      <Navbar isSession={session} />
      
      {hydrated && 
        session ? (
          children
        ) : (
          <div className='flex items-center justify-center h-screen'>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
              className="mt-[100px] w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        )
      }
    </main>
  );
}
