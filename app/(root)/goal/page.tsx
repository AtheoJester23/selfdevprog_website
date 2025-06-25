import { auth } from '@/auth';
import GoalItems from '@/components/goal/GoalItems';
import { client } from '@/sanity/lib/client';
import { GOALS_BY_AUTHOR } from '@/sanity/lib/queries';
import { redirect } from 'next/navigation';
import React from 'react'

export type goalDeets = {
    _id: string,
    title: string,
    description: string,
    duration: string,
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
        <h1 className='text-center font-bold max-sm:text-[2em] sm:text-7xl bg-white text-[rgb(22,22,22)]'>Goals</h1>

        <GoalItems data={goalList}/>
    </section>
  )
}

export default page
