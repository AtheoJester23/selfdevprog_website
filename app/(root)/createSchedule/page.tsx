import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
    const session = await auth();

    if(!session) redirect('/');

  return (
    <div className='mt-[70px]'>
      <input type="time" className='text-black border border-white py-3 placeholder-gray-500' />
    </div>
  )
}

export default page
