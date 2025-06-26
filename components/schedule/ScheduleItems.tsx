"use client"

import { scheds } from '@/app/(root)/schedule/[id]/page'
import { CalendarClock, Plus, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'

const ScheduleItems = ({data}: {data: scheds[]}) => {
  
  const [schedules] = useState<scheds[]>(data ?? []);
  const [notFound] = useState<boolean>(false);
  

  return (
    <div className='bg-[rgb(16,16,16)] p-5'>
     {schedules.length > 0 ? (
          <ul className='rounded grid max-sm:grid-cols-2 md:grid-cols-5 gap-3 text-[16px]'>
              {schedules.map((item, index)=> (
                  <li key={index}>
                      <Link href={`/schedule/${item._id}`} className='max-sm:p-2 sm:p-5 md-p-5 lg-p-5 text-white h-full flex justify-center items-center font-bold max-sm:text-[1em] sm:text-[24px] border rounded hover:text-[rgb(16,16,16)] hover:bg-white duration-200 w-full'>
                          <div className='truncate overflow-hidden whitespace-nowrap max-sm:p-2 sm:p-5 text-center'>
                            <CalendarClock className='w-17 md:w-32 mx-auto' size="100%"/> 
                            {item.title}
                          </div>
                      </Link>
                  </li>
              ))}
          </ul>
      ): notFound && schedules.length === 0 ? (
          <div className='bg-[rgb(16,16,16)] p-5 rounded text-[16px] flex flex-col gap-2 justify-center items-center'>
              <p className='inline text-gray-500'>That goal don&apos;t exist yet...</p>
          </div>
      ):(
          <div className='bg-[rgb(16,16,16)] p-5 rounded text-[16px] flex flex-col gap-2 justify-center items-center'>
              <Link href={`/schedule/create`} className='flex jusity-center items-center gap-2 bg-green-500 text-[rgb(22,22,22)] py-3 px-5 rounded font-bold -translate-y-0.25 hover:translate-none duration-200 cursor-pointer shadow-xl hover:shadow-none'>
                  <PlusCircle className='text-[rgb(16,16,16)] max-sm:w-[30px] sm:w-[3em]' size="100%"/>
                  <p className='max-sm:text-[24px] sm:text-3xl'>Add a Goal</p>
              </Link>
              <p className='inline text-gray-500'>No goal list yet...</p>
          </div>
      )} 

      <div className='flex justify-center items-center'>
        <Link href={`/schedule/createSchedule`} className='hover:bg-[rgb(31,31,31)] h-full border border-gray-500 rounded-full cursor-pointer inline-block py-2 px-5'>
            <h1 className='flex items-center justify-center text-white font-bold text-center'>
                <Plus/>
                Add New Schedule
            </h1>
        </Link>
    </div>
    </div>
  )
}

export default ScheduleItems
