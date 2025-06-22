import React from 'react'
import { paramsType } from '../../schedule/[id]/page'
import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { GOALS_BY_ID } from '@/sanity/lib/queries';
import { goalType } from '@/components/goal/Goalform';
import ActionButtons from '@/components/goal/ActionButtons';

const page = async (prop: {params: paramsType}) => {
    const session = await auth();

    if(!session) redirect('/')

    const { id } = await prop.params;

    console.log("You have to make this live fetching to be able to display realtime, or you can take the long way where you'll utilize state management")
    // *Make this live fetching*
    const goalDetails: goalType[] = await client.fetch(GOALS_BY_ID, {id})

    console.log(goalDetails[0]);
  return (
    <div className='mb-20'>
      <article className='mt-20 p-5 m-5 text-[16px] flex flex-col gap-3'>
        <div className='flex flex-col justify-center items-center mx-auto'>
          <h1 className='text-white font-bold max-sm:text-[2em] sm:text-[4em] text-center '>{goalDetails[0].title}</h1>
          <small className='bg-yellow-500 rounded font-bold max-sm:px-3 max-sm:py-1  sm:px-5 sm:py-2 text-[rgb(22,22,22)] max-sm:text-[12px] sm:text-sm'>Accomplish by: {goalDetails[0].duration}</small>
          <p className='text-white mt-2'>Status: <span className='text-gray-500'>{goalDetails[0].status ? "Accomplished" : "To be accomplished"}</span></p>
        </div>

        <h1 className='text-[1em] text-[rgb(22,22,22)] bg-white text-center p-3'>{goalDetails[0].description}</h1>
      
        <section className='bg-[rgb(16,16,16)] p-5 flex justify-center rounded-b-xl'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-white font-bold max-sm:text-[20px] max-sm:text-center sm:text-[2em]'>How You&apos;ll Make This Happen:</h1>

            
            {goalDetails[0].steps.length != 0 ? (
                <ul>
                  {
                    goalDetails[0].steps.map((item, index) => (
                      <li key={index}>
                        <p className='text-white indent-8 '>&bull; {item.step}</p>
                      </li>
                    ))
                  }
                </ul>
            ):(
                <>
                  <p className='text-center text-gray-500 text-center'>No steps yet — unless doing nothing is part of the plan 😉</p>
                </>
            )}
          </div>
          
          
        </section>
      </article>

      <ActionButtons id={id} data={goalDetails[0]}/>
    </div>
  )
}

export default page
