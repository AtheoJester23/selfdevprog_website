import { auth } from '@/auth'
import UserScheds from '@/components/UserScheds';
import { client } from '@/sanity/lib/client';
import { AUTHOR_BY_GOOGLE_ID_QUERY, SCHEDULE_BY_AUTHOR_QUERY } from '@/sanity/lib/queries';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
    const session = await auth();

    if(!session){
      redirect("/");
    }

    // Step 1: Get the Sanity user document
    const user = await client.fetch(AUTHOR_BY_GOOGLE_ID_QUERY, { id: session.id });

    if (!user?._id) {
      // No associated Sanity user found
      return <p className='text-red-500'>No user profile found.</p>;
    }

    const userId = session.id

    console.log(session);

    const schedules = await client.fetch(SCHEDULE_BY_AUTHOR_QUERY, { id: "114953421027495055482" });
    console.log(schedules);

  return (
    <div className='mt-[70px] p-5'>
      <h1 className='font-bold text-white text-5xl mb-3'>Schedule</h1>
    
      <section className='border border-gray-500 p-5 rounded-2xl'>
    
        <UserScheds id={userId}/>

      </section>
    </div>
  )
}

export default page
