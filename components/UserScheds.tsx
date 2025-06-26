import { CalendarClock, CalendarX, ChevronRight } from 'lucide-react';
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

const UserScheds = async ({schedules}: {schedules: Sched[]}) => {  
  return (
    <>
        { schedules?.length > 0 ? (
            <>
                <ul className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3'>
                    {schedules.map((item: Sched) => (
                        <li key={item._id}>
                            <Link href={`/schedule/${item._id}`} className='block border border-gray-500 p-5 rounded cursor-pointer -translate-y-1 hover:translate-none duration-150'>
                                <div className='truncate overflow-hidden whitespace-nowrap max-sm:p-2 sm:p-5 text-center text-white text-lg'>
                                    <CalendarClock className='w-17 md:w-32 mx-auto' size="100%"/> 
                                    {item.title}
                                </div>
                            </Link>
                        </li>
                    ))} 
                </ul>

                <div className='flex justify-center items-center mt-5'>
                    <Link href={`/schedule`} className='hover:bg-[rgb(31,31,31)] h-full border border-gray-500 rounded-full cursor-pointer inline-block py-2 px-5'>
                        <h1 className='flex items-center justify-center text-white text-sm font-bold text-center'>
                            View All
                            <ChevronRight className='w-[20px] text-gray-400' size="100%"/>
                        </h1>
                    </Link>
                </div>
            </>

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
