"use client"

import React, { useEffect } from 'react'
import { initFlowbite } from 'flowbite';

import { AlignJustify, CalendarDays, Goal, Home, UserRound } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { signIn, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import Image from 'next/image';
import CreateButton from './CreateButton';


interface NavbarProps{
  isSession: Session | null
}

const Navbar = ({isSession}: NavbarProps) => {  
  // I added isSession as dependency... remove if there's an error
  useEffect(()=>{
    if(isSession) initFlowbite();
  },[isSession]);

  return (
    <header>
      <nav className='p-3 bg-[rgb(12,12,12)] flex h-[66px] fixed top-0 left-0 right-0 z-10 justify-between shadow-lg'>
        <div className='flex items-center'>
          {isSession ? (
              <button 
                className='p-2 rounded-full hover:bg-[rgb(50,50,50)] cursor-pointer' 
                type='button'
                data-drawer-target="my-drawer"
                data-drawer-show="my-drawer"
                aria-controls="my-drawer"
              >
                  <AlignJustify className='text-white'/>
              </button>
            ) : 
              ''
          }
          <div className='flex items-center gap-4'>
            <a href={'/dashboard'} className='inline-flex items-center max-sm:w-[150px] md:w-[200px]'>
                <Image src="/Logo.png" width={200} height={20} alt="logo" className='w-full'/>
            </a>
          </div>
        </div>

        <div className='flex items-center gap-2 me-5 text-[14px]'>
          { isSession ? (
              <div className='max-sm:hidden sm:visible'>
                <div className='flex items-center gap-2'>
                    <CreateButton/>
        
                    <button 
                      className='cursor-pointer testing'
                      type='button'
                      data-drawer-target="my-drawer"
                      data-drawer-show="my-drawer"
                      aria-controls="my-drawer"
                    >
                      <Avatar>
                          <AvatarImage src={isSession?.user?.image ?? undefined} />
                          <AvatarFallback>X</AvatarFallback>
                      </Avatar>
                    </button>
                </div>
              </div>
          ) : 
              <button 
                  onClick={() => {
                      // Just in case: redirect to signOut first (optional)
                      signOut({ redirect: false }).then(() =>
                      signIn("google", {redirectTo: "/dashboard"}, { prompt: "select_account" })
                      );
                  }}
                  className='text-white border px-7 py-1 rounded-xl cursor-pointer hover:bg-white hover:text-black' 
              >
                      Sign In
              </button>
          }
        </div>
      </nav>

      <div
        id="my-drawer"
        className="bg-[rgb(22,22,22)] fixed top-0 left-0 z-40 h-screen w-64 overflow-y-auto p-4 transition-transform -translate-x-full flex flex-col gap-5 shadow-xl"
        tabIndex={-1}
        aria-labelledby="drawer-label"
      >
        <button
          type="button"
          data-drawer-hide="my-drawer"
          aria-controls="my-drawer"
          className="mt-4 text-red-500 cursor-pointer"
        >
          <AlignJustify className='text-white'/>
        </button>

        <Link href="/dashboard" data-drawer-hide="my-drawer" aria-controls="my-drawer" passHref className='flex text-[16px] items-center gap-5 bg-[rgb(191,4,38)] text-white font-bold p-3 rounded cursor-pointer flex hover:bg-white hover:text-[rgb(23,23,23)] duration-200'>
            <Home className='w-[24px]' size="100%"/>
            Home
        </Link>

        <Link href="/schedule" data-drawer-hide="my-drawer" aria-controls="my-drawer" passHref className='flex text-[16px] items-center gap-5 bg-[rgb(191,4,38)] text-white font-bold p-3 rounded cursor-pointer flex hover:bg-white hover:text-[rgb(23,23,23)] duration-200'>
            <CalendarDays className='w-[24px]' size="100%"/>
            Schedules
        </Link>

        <Link href="/goal" data-drawer-hide="my-drawer" aria-controls="my-drawer" passHref className='flex text-[16px] items-center gap-5 bg-[rgb(191,4,38)] text-white font-bold p-3 rounded cursor-pointer flex hover:bg-white hover:text-[rgb(23,23,23)] duration-200'>
            <Goal className='w-[24px]' size="100%"/>
            Goals
        </Link>

        <Link href="/profile" data-drawer-hide="my-drawer" aria-controls="my-drawer" passHref className='flex text-[16px] items-center gap-5 bg-[rgb(191,4,38)] text-white font-bold p-3 rounded cursor-pointer flex hover:bg-white hover:text-[rgb(23,23,23)] duration-200'>
            <UserRound className='w-[24px]' size="100%"/>
            Profile
        </Link>

        <button onClick={() => signOut({ callbackUrl: "/" })} className='font-bold text-white border border-white rounded py-3 hover:bg-[white] hover:text-[rgb(22,22,22)] cursor-pointer'>Logout</button>
      </div>
    </header>
  );
}

export default Navbar
