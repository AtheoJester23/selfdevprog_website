'use client';

import dynamic from 'next/dynamic';
import { Session } from 'next-auth';
import { motion } from "framer-motion"
import { useEffect, useState } from 'react';
//to check if it's the first page...
import { usePathname } from 'next/navigation';

const Navbar = dynamic(() => import('./Navbar'),{
  ssr: false,
});

export default function ClientLayout({ session, children,} : { session: Session | null; children: React.ReactNode;}) {
  const [hydrated, setHydrated] = useState(false);

  const pathName = usePathname();

  if(pathName === "/goal/edit/hJrWNdh599drBHMnS6mqpH"){
    console.log("This is that path....")
  }else{
    console.log(pathName);
  }


  useEffect(() => {
    setHydrated(true);
  }, []);
  
  return (
    <main>
      <Navbar isSession={session} />
      
      {hydrated && 
        session ? (
          children
        ) : pathName === "/" ? (
          children
        ):(
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
