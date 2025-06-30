import { auth } from '@/auth'
import RecentGoals from '@/components/goal/RecentGoals';
import UserScheds from '@/components/UserScheds';
import { client } from '@/sanity/lib/client';
import { RECENT_GOALS_BY_AUTHOR, RECENT_SCHEDS_BY_AUTHOR } from '@/sanity/lib/queries';
import { CalendarDays, Goal } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
    const session = await auth();

    if(!session){
      redirect("/");
    }

    const [schedules, goals] = await Promise.all([
      await client.fetch(RECENT_SCHEDS_BY_AUTHOR, { id: session.id }),
      await client.fetch(RECENT_GOALS_BY_AUTHOR, {id: session.id})
    ])
    

  return (
    <div className='flex flex-col gap-5'>
      <section className='mt-[70px] p-5 shadow-xl'>
        <div className='ms-5 flex max-sm:gap-2 sm:gap-4 items-center text-white max-sm:text-[2em] sm:text-7xl mb-3'>
          <CalendarDays className='max-sm:w-[30px] sm:w-[50px]' size="100%"/>
          <h1 className='font-bold text-white'>Schedules</h1>
        </div>
      
        <div className='border border-gray-500 p-5 rounded'>
          <UserScheds schedules={schedules}/>
        </div>
      </section>

      <section className='py-5 mb-5'>
        <div className='ms-5 flex max-sm:gap-2 sm:gap-4 items-center text-white max-sm:text-[2em] sm:text-7xl mb-3'>
          <Goal className='max-sm:w-[30px] sm:w-[50px]' size="100%"/>
          <h1 className='font-bold text-white'>Goals</h1>
        </div>

        <div>
          <RecentGoals goals={goals}/>
        </div>
      </section>
    </div>
  )
}

export default page
