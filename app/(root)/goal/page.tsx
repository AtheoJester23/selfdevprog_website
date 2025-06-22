import { auth } from '@/auth';
import { client } from '@/sanity/lib/client';
import { GOALS_BY_AUTHOR } from '@/sanity/lib/queries';
import { Plus, PlusCircle } from 'lucide-react';
import Link from 'next/link'
import { redirect } from 'next/navigation';
import React from 'react'

type goalDeets = {
    _id: string,
    title: string,
    description: string,
    duration: string,
    steps: {
        step: string,
        status: string
    }[]
}

const page = async () => {
    const session = await auth();

    if(!session) redirect("/")

    const goalList: goalDeets[] = await client.fetch(GOALS_BY_AUTHOR, {id: session.id})

    console.log(goalList)
  return (
    <section className='mt-[80px] m-5 rounded flex gap-5 flex-col'>
        <h1 className='text-center font-bold text-7xl bg-white text-[rgb(22,22,22)]'>Goals</h1>


        {goalList.length > 0 ? (
            <ul className='bg-[rgb(16,16,16)] p-5 rounded grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4  gap-3 text-[16px]'>
                {goalList.map((item, index)=> (
                    <li key={index}>
                        <Link href={`/goal/${item._id}`} className='max-sm:p-2 sm:p-5 md-p-5 lg-p-5 text-white h-full flex justify-center items-center font-bold text-[2em] border rounded hover:text-[rgb(16,16,16)] hover:bg-white duration-200 truncate w-full overflow-hidden whitespace-nowrap'>
                            <div className='truncate overflow-hidden whitespace-nowrap'>
                                {item.title}
                            </div>
                        </Link>
                    </li>
                ))}
                <li>
                    <Link href={`/goal/newGoal`} className='max-sm:p-2 sm:p-5 md-p-5 lg-p-5 text-white h-full flex justify-center items-center font-bold text-[2em] border rounded hover:text-[rgb(16,16,16)] hover:bg-white duration-200 truncate w-full hover:text-[rgb(16,16,16)]'>
                        <Plus className='text-[2em]'/>
                    </Link>
                </li>
            </ul>
        ):(
            <div className='bg-[rgb(16,16,16)] p-5 rounded text-[16px] flex flex-col gap-2 justify-center items-center'>
                <Link href={`/goal/newGoal`} className='flex jusity-center items-center gap-2 bg-green-500 text-[rgb(22,22,22)] py-3 px-5 rounded font-bold -translate-y-0.25 hover:translate-none duration-200 cursor-pointer shadow-xl hover:shadow-none'>
                    <PlusCircle className='text-[rgb(16,16,16)] max-sm:w-[30px] sm:w-[3em]' size="100%"/>
                    <p className='max-sm:text-[24px] sm:text-3xl'>Add a Goal</p>
                </Link>
                <p className='inline text-gray-500'>No goal list yet...</p>
            </div>
        )}
    </section>
  )
}

export default page
