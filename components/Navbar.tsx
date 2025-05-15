"use client"

import React, { useEffect } from 'react'
import { initFlowbite } from 'flowbite';

import { AlignJustify, Plus } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { signIn, signOut } from 'next-auth/react';


const Navbar = ({isSession}:{isSession: object}) => {  
  useEffect(()=>{
    if(isSession) initFlowbite();
  },[]);
  
  return (
    <div>
      <div className='p-3 bg-[rgb(12,12,12)] flex h-[66px] fixed top-0 left-0 right-0 z-10 justify-between shadow-lg'>
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
            <Link href={'/'} className='inline-flex items-center w-[200px]'>
                <img src="Logo.png" alt="logo" className='w-full'/>
            </Link>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          { isSession ? (
              <>
                  <div className=''>
                      <div className='border border-white rounded-full p-1 flex px-3 cursor-pointer hover:bg-white hover:text-black text-white duration-200 items-center'>
                          <Plus/>
                          <p>Create</p>
                      </div>
                  </div>
                
      
                  <button 
                    className='cursor-pointer'
                    type='button'
                    data-drawer-target="my-drawer"
                    data-drawer-show="my-drawer"
                    aria-controls="my-drawer"
                  >
                    <Avatar>
                        <AvatarImage src={isSession?.user?.image} />
                        <AvatarFallback>X</AvatarFallback>
                    </Avatar>
                  </button>
              </>
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
      </div>

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

        <a 
          href="/dashboard" 
          className='bg-[rgb(191,4,38)] text-[rgb(22,22,22)] text-center font-bold py-3 rounded-xl'
        >
          Dashboard
        </a>

        <a 
          href="/createSchedule" 
          className='bg-[rgb(191,4,38)] text-[rgb(22,22,22)] text-center font-bold py-3 rounded-xl'
        >
          Create Schedule
        </a>

        <button onClick={() => signOut({ callbackUrl: "/" })} className='font-bold text-white border border-white rounded-xl py-3 hover:bg-[white] hover:text-[rgb(22,22,22)] cursor-pointer'>Logout</button>
      </div>
    </div>
  );
}

export default Navbar
