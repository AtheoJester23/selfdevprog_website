import React from 'react'
import Link from 'next/link'
import { auth } from '@/auth';
import { AlignJustify, Plus, Search } from 'lucide-react';
import Profilemenu from './profileMenu';
const Navbar = async () => {
    const session = await auth();

  return (
    <header>
        <nav className='bg-[rgb(12,12,12)] py-4 px-5 fixed top-0 left-0 right-0 flex justify-between shadow-lg z-10'>
            <div className='flex items-center gap-4'>
                <div className='p-2 rounded-full hover:bg-[rgb(50,50,50)] cursor-pointer'>
                    <AlignJustify className='text-white'/>
                </div>
                
                
                <Link href={'/'} className='inline-flex items-center w-[200px]'>
                    <img src="Logo.png" alt="logo" className='w-full'/>
                </Link>
            </div>

            {/*
            <div className='flex items-center gap-[0.5px]'>
                <input type="text" className='bg-[rgb(23,23,23)] py-2 text-white rounded-s-full px-5 border border-[rgb(33,33,33)] focus:outline focus:outline-sky-700' placeholder='Search'/>
                <div className='bg-[rgb(23,23,23)] py-2 w-[50px] flex items-center justify-center rounded-e-full border border-[rgb(33,33,33)] cursor-pointer'>
                    <Search className='text-white'/>
                </div>
            </div>
            */}

            <div className='flex items-center gap-2'>
                <Profilemenu 
                    isAuthenticated={!!session?.user}
                    userId={session?.id}
                    sessionImg={session?.user?.image}
                />
            </div>
        </nav>
    </header>
  )
}

export default Navbar
