import Goalform from '@/components/goal/Goalform'
import React from 'react'

const page = () => {
  return (
    <section className='mt-[95px] text-[16px]'>
      <div className='flex justify-center items-center '>
        <h1 className='text-white font-bold text-[3em] border-5 px-5 py-3 rounded border-dashed'>Create Goal Page</h1>
      </div>
    
      <Goalform data={null} id={null}/>
    </section>
  )
}

export default page
