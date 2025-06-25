import { auth } from '@/auth'
import RecentGoals from '@/components/goal/RecentGoals';
import UserScheds from '@/components/UserScheds';
import { client } from '@/sanity/lib/client';
import { AUTHOR_BY_GOOGLE_ID_QUERY, RECENT_GOALS_BY_AUTHOR, SCHEDULE_BY_AUTHOR_QUERY } from '@/sanity/lib/queries';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
    const session = await auth();

    if(!session){
      redirect("/");
    }

    const [user, schedules, goals] = await Promise.all([
      await client.fetch(AUTHOR_BY_GOOGLE_ID_QUERY, { id: session.id }),
      await client.fetch(SCHEDULE_BY_AUTHOR_QUERY, { id: session.id }),
      await client.fetch(RECENT_GOALS_BY_AUTHOR, {id: session.id})
    ])
    

    if (!user?._id) {
      // No associated Sanity user found
      return <p className='text-red-500'>No user profile found.</p>;
    }

  return (
    <>
      <section className='mt-[70px] p-5'>
        <h1 className='font-bold text-white max-sm:text-[2em] sm:text-7xl mb-3'>Schedules</h1>
      
        <div className='border border-gray-500 p-5 rounded-2xl'>
          <UserScheds schedules={schedules}/>
        </div>
      </section>

      <section className='p-5 mb-5'>
        <h1 className='font-bold text-white max-sm:text-[2em] sm:text-7xl mb-3'>Goals</h1>

        <div>
          <RecentGoals goals={goals}/>
        </div>
      </section>
    </>
  )
}

export default page
