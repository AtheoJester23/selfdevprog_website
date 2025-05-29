import React from 'react'

const page = ({params}: {params: {id: string}}) => {
    const { id } = params

  return (
    <div className='mt-[70px] p-5'>
        <h1 className="text-white font-bold text-4xl">This is edit page</h1>
    </div>
  )
}

export default page
