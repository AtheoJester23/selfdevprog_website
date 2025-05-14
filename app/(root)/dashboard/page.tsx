import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
    const session = await auth();

    if(!session) redirect("/");

  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

export default page
