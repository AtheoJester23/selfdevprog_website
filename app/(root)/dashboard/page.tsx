import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import React from 'react'
const page = async () => {
    const session = await auth();

    if(!session) redirect("/");

  return (
    <div className='mt-[70px] p-5'>
      <h1 className='font-bold text-white text-5xl mb-3'>Schedule</h1>
    
      <section className='border border-gray-500 p-5 rounded-2xl'>
      
        <p className='text-gray-500'>No schedule set up...</p>
      
      </section>
    </div>
  )
}

export default page
