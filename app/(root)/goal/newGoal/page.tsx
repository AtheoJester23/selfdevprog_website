import { auth } from '@/auth'
import Goalform from '@/components/goal/Goalform'
import { client } from '@/sanity/lib/client';
import { GOALS_BY_AUTHOR } from '@/sanity/lib/queries';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  const session = await auth();

  if(!session) redirect("/");

  const goalsData = await client.fetch(GOALS_BY_AUTHOR, {id: session.id})

  return (
    <section className='mt-[95px] text-[16px]'>
      <div className='flex justify-center items-center '>
        <h1 className='text-white font-bold max-sm:text-[24px] sm:text-[3em] border-5 px-5 py-3 rounded border-dashed'>Create Goal Page</h1>
      </div>
    
      <Goalform data={goalsData} id={session.id} create={true} session_id={session.id}/>
    </section>
  )
}

export default page
