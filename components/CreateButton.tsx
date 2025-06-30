"use client"

import { Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const CreateButton = () => {
    const [create, setCreate] = useState<boolean>(false);

    useEffect(() => {
        const btnCreate = document.getElementById("createBtn") as HTMLButtonElement

        const handleClick = () => {
            setCreate(prev => {
                const newVal = !prev
                console.log(newVal)
                return newVal;
            });
        }

        btnCreate.addEventListener("click", handleClick)

        return () => {
            btnCreate?.removeEventListener("click", handleClick);
        };
    }, []);
    
  return (
    <div className='relative'>
        <button id='createBtn' className='border border-white rounded-full p-1 flex px-3 cursor-pointer hover:bg-white hover:text-black text-white duration-200 items-center'>
            <Plus/>
            <p>Create</p>
        </button>
        
        <ul className={`absolute flex flex-col bg-[rgb(16,16,16)] py-2 rounded ${!create ? "hidden" : "visible"}`}>
            <Link onClick={()=>setCreate(false)} href='/goal/newGoal' className='font-bold text-white whitespace-nowrap hover:bg-[rgb(23,23,23)] cursor-pointer p-5'>Create a goal</Link>
            <Link onClick={()=>setCreate(false)} href='/schedule/createSchedule' className='font-bold text-white whitespace-nowrap hover:bg-[rgb(23,23,23)] cursor-pointer p-5'>Create a Schedule</Link>
        </ul>
    </div>
  )
}

export default CreateButton
