import { client } from '@/sanity/lib/client';
import { SCHEDULE_BY_AUTHOR_QUERY } from '@/sanity/lib/queries';
import { CalendarClock, CalendarX, Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { Entry } from './Addtime';

export type Sched = {
    allTime: Entry[],
    title: string,
    user: {_id: string, image: string, name: string},
    _createdAt: string,
    _id: string
}

const UserScheds = async ({id}: {id: string}) => {
  
    console.log(id);

    const schedules: Sched[] = await client.fetch(SCHEDULE_BY_AUTHOR_QUERY, {id});
  
    console.log("abcdefg", schedules);
  
  return (
    <>
        { schedules?.length > 0 ? (
            <ul className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3'>
                {schedules.map((item: Sched) => (
                    <li key={item._id}>
                        <Link href={`/schedule/${item._id}`} className='block border border-gray-500 p-5 rounded cursor-pointer -translate-y-1 hover:translate-none duration-150'>
                            <div className='flex justify-center flex-col items-center'>
                                <CalendarClock className='text-white w-17 md:w-32' size="100%"/>
                                <h1 className='text-white text-lg font-bold'>{item.title}</h1>
                            </div>
                        </Link>
                    </li>
                ))} 
                <li>
                    <Link href={`/schedule/createSchedule`} className='block h-full border border-gray-500 p-5 rounded cursor-pointer -translate-y-1 hover:translate-none duration-150'>
                        <Plus className='text-white w-17 md:w-32 mx-auto' size="100%"/>
                    </Link>
                </li>
            </ul>
        ): (
            <div className='flex justify-center items-center flex-col gap-3'>
                <div className='flex justify-center flex-col items-center'>
                    <CalendarX className='text-gray-500' size={150}/>
                    <h1 className='text-gray-500 text-lg font-bold'>No Schedule Yet...</h1>
                </div>
                
                <Link href={`/schedule/createSchedule`} className='bg-green-500 text-[rgb(22,22,22)] py-2 px-3 rounded font-bold -translate-y-0.25 hover:translate-none duration-200 cursor-pointer shadow-xl hover:shadow-none'>
                    Add Schedule
                </Link>
            </div>
        )}
    </>
  )
}

export default UserScheds
