import { auth } from '@/auth'
import Addtime from '@/components/Addtime';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
    const session = await auth();

    if(!session) redirect('/');

  return (
    <section className='p-5 mt-[70px]'>
      <div className='flex justify-center'>
        <h1 className='text-[rgb(22,22,22)] bg-white font-bold text-center sm:text-4xl px-5 py-2 border border-white rounded inline'>Create Schedule</h1>
      </div>

      <Addtime schedule={null} id={null}/>
    </section>
  )
}

export default page
