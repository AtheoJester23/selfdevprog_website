import { auth } from '@/auth'
import Profileform from '@/components/profile/Profileform';

import { client } from '@/sanity/lib/client';
import { AUTHOR_BY_GOOGLE_ID_QUERY, GOALS_BY_AUTHOR } from '@/sanity/lib/queries';
import { redirect } from 'next/navigation';
import React from 'react'
import { goalDeets } from '../../goal/page';

export type userDeets = {
  _id: string,
  email: string,
  id: string,
  name: string,
  username: string,
  quote: string
}

const page = async () => {
  const session = await auth();

  if(!session) redirect('/');

  const userDetails: userDeets = await client.fetch(AUTHOR_BY_GOOGLE_ID_QUERY, {id: session.id});
  const allGoals: goalDeets[] = await client.fetch(GOALS_BY_AUTHOR, {id: session.id});

  return (
    <section className='h-screen flex justify-center items-center'>
      <div className='bg-[rgb(16,16,16)] p-5 rounded-lg shadow-xl max-sm:w-[90%] sm:w-[50%] mt-[50px]'>
        <h1 className='text-white text-center font-bold text-[32px]'>Profile</h1>
        
        <Profileform userDetails={userDetails} allGoals={allGoals}/>
      </div>
    </section>
  )
}

export default page
