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
            <div className='grid grid-cols-5 gap-3 sm:grid-cols-2 md:grid-cols-4'>
                {schedules.map((item: any) => (
                    <Link href={`/schedule/${item._id}`} key={item._id} className='border border-gray-500 rounded p-5 cursor-pointer -translate-y-1 hover:translate-none duration-150'>
                        <div className='flex justify-center flex-col items-center'>
                            <CalendarClock className='text-white' size={150}/>
                            <h1 className='text-white text-lg font-bold'>{item.title}</h1>
                        </div>
                    </Link>
                ))} 
                <Link href={`/schedule/createSchedule`} className='border border-gray-500 rounded p-5 cursor-pointer flex justify-center items-center justify-center -translate-y-1 hover:translate-none duration-150'>
                    <Plus className='text-white' size={150}/>
                </Link>
            </div>
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
