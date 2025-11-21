import { auth } from '@/auth'
import RecentGoals from '@/components/goal/RecentGoals';
import UserNotes from '@/components/notes/UserNotes';
import UserScheds from '@/components/UserScheds';
import { client } from '@/sanity/lib/client';
import { NOTES_BY_AUTHOR, RECENT_GOALS_BY_AUTHOR, RECENT_SCHEDS_BY_AUTHOR } from '@/sanity/lib/queries';
import { CalendarDays, Goal, NotepadText, Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
    const session = await auth();

    if(!session) redirect("/");

    const temporaryPins = [
      {id: 0, name: "test"},
      {id: 1, name: "test2"}
    ]
    
    const [schedules, goals, theNotes] = await Promise.all([
      await client.fetch(RECENT_SCHEDS_BY_AUTHOR, { id: session.id }),
      await client.fetch(RECENT_GOALS_BY_AUTHOR, {id: session.id}),
      await client.fetch(NOTES_BY_AUTHOR, {id: session.id})
    ])
    
    console.log(theNotes)

  return (
    <div className='flex flex-col gap-5'>
      {temporaryPins.length > 0 && (
        <section className='bg-white rounded mt-[90px] p-5 shadow-xl mx-5'>
          <div className='flex justify-between items-center'>
            <div className='ms-5 flex max-sm:gap-2 sm:gap-4 items-center text-black max-sm:text-[2em] sm:text-7xl mb-3'>
              <NotepadText className='max-sm:w-[30px] sm:w-[50px]' size="100%"/>
              <h1 className='font-bold'>Note</h1>
            </div>

            <Link href='/note' className='flex jusity-center border items-center gap-2 hover:bg-black text-black hover:text-white py-3 px-5 rounded-xl font-bold -translate-y-0.25 hover:translate-none duration-200 cursor-pointer shadow-xl hover:shadow-none'>
                <Plus className='max-sm:w-[20px] sm:w-[2em]' size="100%"/>
            </Link>
          </div>

          <UserNotes prop={theNotes}/>
        </section>
      )}
      
      <section className={`${temporaryPins.length > 0 ? " " : "mt-[70px]"} p-5 shadow-xl`}>
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
