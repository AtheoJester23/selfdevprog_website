import { goalDeets } from '@/app/(root)/goal/page'
import { ChevronRight} from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const RecentGoals = ({goals}: {goals: goalDeets[]}) => {
  
  console.log(goals);

  return (
    <div className='bg-[rgb(16,16,16)] p-5'>
      { goals?.length > 0 ? (

            <>
                <ul className='grid max-sm:grid-cols-1 md:grid-cols-5 gap-3 p-5'>
                    {goals.map((item: goalDeets) => (
                        <li key={item._id}>
                            <Link href={`/goal/${item._id}`} className='block h-full border border-gray-500 p-5 rounded cursor-pointer -translate-y-1 hover:translate-none duration-150'>
                                <div className='flex justify-center flex-col items-center'>
                                    <h1 className='line-clamp-2 text-white text-lg font-bold text-center'>{item.title}</h1>
                                </div>
                            </Link>
                        </li>
                    ))} 
                </ul>
                
                <div className='flex justify-center items-center'>
                    <Link href={`/goal`} className='hover:bg-[rgb(31,31,31)] h-full border border-gray-500 rounded-full cursor-pointer inline-block py-2 px-5'>
                        <h1 className='flex items-center justify-center text-white text-sm font-bold text-center'>
                            View All Goals
                            <ChevronRight className='w-[20px] text-gray-400' size="100%"/>
                        </h1>
                    </Link>
                </div>
            </>
            
        ): (
            <div className='flex justify-center items-center flex-col gap-3'>
                <div className='flex justify-center flex-col items-center'>
                    <h1 className='text-gray-500 text-lg font-bold'>No Schedule Yet...</h1>
                </div>
                
                <Link href={`/goal/newGoal`} className='bg-green-500 text-[rgb(22,22,22)] py-2 px-3 rounded font-bold -translate-y-0.25 hover:translate-none duration-200 cursor-pointer shadow-xl hover:shadow-none'>
                    Add Goal
                </Link>
            </div>
        )}
    </div>
  )
}

export default RecentGoals
