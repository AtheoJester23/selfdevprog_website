import { paramsType } from '@/app/(root)/schedule/[id]/page';
import { auth } from '@/auth'
import Goalform, { goalType } from '@/components/goal/Goalform'
import { client } from '@/sanity/lib/client';
import { GOALS_BY_ID } from '@/sanity/lib/queries';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async (prop: {params: paramsType} ) => {
    const session = await auth();

    if(!session) redirect("/");

    const { id } = await prop.params

    const goalDeets: goalType[] = await client.fetch(GOALS_BY_ID, {id});

  return (
    <section className='mt-25'>
        <div className='flex justify-center items-center '>
            <h1 className='text-white font-bold text-[3em] border-5 px-5 py-3 rounded border-dashed'>Edit Goal Details</h1>
        </div>
        <Goalform data={goalDeets} id={id}/>
    </section>
  )
}

export default page
