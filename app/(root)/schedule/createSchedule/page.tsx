import { auth } from '@/auth'
import Addtime from '@/components/Addtime';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
    const session = await auth();

    if(!session) redirect('/');

  return (
    <div className='p-5 mt-[70px]'>
      <Addtime schedule={null} id={null}/>
    </div>
  )
}

export default page
