import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import React from 'react'
import { scheds } from './[id]/page';
import { client } from '@/sanity/lib/client';
import { SCHEDULE_BY_AUTHOR_QUERY } from '@/sanity/lib/queries';
import ScheduleItems from '@/components/schedule/ScheduleItems';

const page = async () => {
  const session = await auth();
  
  if(!session) redirect("/");

  const allScheds: scheds[] = await client.fetch(SCHEDULE_BY_AUTHOR_QUERY, { id: session.id })

  return (
    <section className='mt-[80px] m-5 rounded flex gap-5 flex-col'>
      <h1 className='text-center font-bold max-sm:text-[2em] sm:text-7xl text-white shadow-lg border-y'>Schedules</h1>
        
      <ScheduleItems data={allScheds}/>
    </section>  
  )
}

export default page
