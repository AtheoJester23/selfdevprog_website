import { auth } from '@/auth';
import GoalItems from '@/components/goal/GoalItems';
import { client } from '@/sanity/lib/client';
import { GOALS_BY_AUTHOR } from '@/sanity/lib/queries';
import { FlagTriangleLeft, FlagTriangleRight } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

export type goalDeets = {
    _id: string,
    title: string,
    description: string,
    duration: string,
    status: boolean,
    steps: {
        step: string,
        status: string
    }[]
}

const page = async () => {
    const session = await auth();

    if(!session) redirect("/")

    const goalList: goalDeets[] = await client.fetch(GOALS_BY_AUTHOR, {id: session.id})

    // console.log(goalList)
    
  return (
    <section className='mt-[80px] m-5 rounded flex gap-5 flex-col'>        
        <div className='text-[rgb(22,22,22)] max-sm:text-[2em] sm:text-7xl bg-white flex justify-center items-center'>
          <FlagTriangleLeft className='max-sm:w-[24px] sm:w-[40px]' size="100%"/>
          <h1 className='font-bold'>Goals</h1>
          <FlagTriangleRight className='max-sm:w-[24px] sm:w-[40px] inline' size="100%"/>
        </div>

        <GoalItems data={goalList}/>
    </section>
  )
}

export default page
