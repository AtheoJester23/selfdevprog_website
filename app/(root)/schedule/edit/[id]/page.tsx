import Addtime from '@/components/Addtime'
import { client } from '@/sanity/lib/client'
import { SCHEDULE_BY_ID } from '@/sanity/lib/queries'
import React from 'react'
import { paramsType } from '../../[id]/page'

const page = async (prop: {params: paramsType} ) => {
    const { id } = await prop.params

    const sched = await client.fetch(SCHEDULE_BY_ID, {id});

    console.log(sched[0]);

  return (
    <div className='mt-[70px] p-5'>
        <h1 className="text-white font-bold text-4xl">This is edit page</h1>

        <Addtime schedule={sched[0]} id={id}/>
    </div>
  )
}

export default page
