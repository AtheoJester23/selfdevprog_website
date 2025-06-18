import Addtime from '@/components/Addtime'
import { client } from '@/sanity/lib/client'
import { SCHEDULE_BY_ID } from '@/sanity/lib/queries'
import React from 'react'
import { paramsType } from '../../[id]/page'

const page = async (prop: {params: paramsType} ) => {
    const { id } = await prop.params

    const sched = await client.fetch(SCHEDULE_BY_ID, {id});

  return (
    <section className='mt-[70px] p-5'>
        <div className='flex justify-center'>
          <h1 className="font-bold rounded p-3 max-sm:text-[20px] sm:text-4xl text-center bg-white text-[rgb(22,22,22)]">Edit Schedule</h1>
        </div>

        <Addtime schedule={sched[0]} id={id}/>
    </section>
  )
}

export default page
