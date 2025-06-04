'use client'

import { signIn, signOut } from 'next-auth/react';
import React from 'react'

const Startbutton = ({isSession}: {isSession: boolean}) => {
  return (
    <>
        { isSession ? (
            <a href="/dashboard" className="button bg-black text-white px-5 py-3 rounded-xl mt-5 w-[200px] text-center -translate-y-1 hover:translate-none duration-200 hover:text-black hover:bg-white font-bold shadow-lg hover:shadow-none">Let&apos;s Go!</a>
        ) : 
        <button 
            onClick={() => {
                // Just in case: redirect to signOut first (optional)
                signOut({ redirect: false }).then(() =>
                signIn("google", {redirectTo: "/dashboard"}, { prompt: "select_account" })
                );
            }} 
            className="cursor-pointer button bg-black text-white px-5 py-3 rounded-xl mt-5 w-[200px] text-center -translate-y-1 hover:translate-none duration-200 hover:text-black hover:bg-white font-bold shadow-lg hover:shadow-none"
        >
            Let&apos;s Get Started!
        </button>
        }
    </>
  )
}

export default Startbutton
