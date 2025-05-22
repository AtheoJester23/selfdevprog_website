import { auth } from '@/auth'
import Addtime from '@/components/Addtime';
import { Clock, Plus } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
    const session = await auth();

    if(!session) redirect('/');

    const handleSubmit = () => {
        console.log("Testing")
    }

  return (
    <div className='p-5 mt-[70px]'>
        <h1 className='text-5xl text-white font-bold'>Create Schedule Page</h1>
    
        <Addtime/>
    </div>
  )
}

export default page
