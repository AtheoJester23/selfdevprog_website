"use client"

import React, { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { signIn, signOut } from 'next-auth/react';
import { Plus } from 'lucide-react';

const Profilemenu = ({isAuthenticated, userId, sessionImg}: {
    isAuthenticated: boolean;
    userId?: string;
    sessionImg: string;
}) => {
    useEffect(()=>{
        const profile = document.getElementById("profile-pic")
        const profilePop = document.getElementById("profPop");

        profile?.addEventListener('click', (event: MouseEvent) => {
            const isHidden = profilePop?.classList.contains('hidden');

            isHidden ? profilePop?.classList.remove('hidden') : profilePop?.classList.add('hidden')

        })
    }, [])

  return (
    <>
        { isAuthenticated ? (
            <>
                <div className=''>
                    <div className='border border-white rounded-full p-1 flex px-3 cursor-pointer hover:bg-white hover:text-black text-white duration-200 items-center'>
                        <Plus/>
                        <p>Create</p>
                    </div>
                </div>
                <div className='cursor-pointer relative'>
                    <div id='profile-pic'>
                        <Avatar>
                            <AvatarImage src={sessionImg}/>
                            <AvatarFallback>X</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='bg-[rgb(23,23,23)] absolute bottom-[-115px] right-0 p-1 rounded-xl hidden flex flex-col' id="profPop">  
                        <a href='/profile' className='text-white cursor-pointer bg-[rgb(12,12,12)] hover:bg-[rgb(23,23,23)]  hover:bg-black px-5 py-3 rounded-xl duration-200'>Profile</a>
                        <button onClick={()=>signOut({redirectTo: "/"})} className='text-white cursor-pointer hover:bg-red-500 px-5 py-3 rounded-xl duration-200'>Logout</button> 
                    </div>
                </div>
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
    </>
  )
}

export default Profilemenu
