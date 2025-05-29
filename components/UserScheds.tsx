import { client } from '@/sanity/lib/client';
import { SCHEDULE_BY_AUTHOR_QUERY } from '@/sanity/lib/queries';
import { CalendarClock, Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const UserScheds = async ({id}: {id: string}) => {
  
    console.log(id);

    const schedules = await client.fetch(SCHEDULE_BY_AUTHOR_QUERY, {id});
  
    console.log("abcdefg", schedules);
  
  return (
    <div className='grid grid-cols-5 gap-3 sm:grid-cols-2 md:grid-cols-4'>
        {schedules?.length > 0 ? (
            schedules.map((item: any) => (
                <Link href={`/schedule/${item._id}`} key={item._id} className='border border-gray-500 rounded p-5 cursor-pointer -translate-y-1 hover:translate-none duration-150'>
                    <div className='flex justify-center flex-col items-center'>
                        <CalendarClock className='text-white' size={150}/>
                        <h1 className='text-white text-lg font-bold'>{item.title}</h1>
                    </div>
                </Link>
            )) 
        ) : (
            <p className='text-white'>abcdefg</p>
        )}
        <Link href={`/schedule/createSchedule`} className='border border-gray-500 rounded p-5 cursor-pointer flex justify-center items-center justify-center -translate-y-1 hover:translate-none duration-150'>
            <Plus className='text-white' size={150}/>
        </Link>
    </div>
  )
}

export default UserScheds
