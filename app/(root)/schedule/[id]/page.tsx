import ActionButtons from '@/components/ActionButtons';
import DeleteSched from '@/components/DeleteSched';
import { client } from '@/sanity/lib/client';
import { SCHEDULE_BY_ID } from '@/sanity/lib/queries';
import { Pencil, Printer, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const page = async ({params}: {params: {id: string}}) => {
  // const theId = (await params);
  const { id } = await params

  console.log(id);

  const schedule = await client.fetch(SCHEDULE_BY_ID, {id});

  console.log(schedule);



  // console.log(theId);
  
  return (
    <div className='mt-[80px] p-5'>
      <h1 className="text-white text-5xl font-bold mb-[30px] text-center">{schedule[0].title}</h1>
      
      <section className='flex flex-col gap-3'>
        {schedule[0].allTime.map((item: any) => (
          <div key={item.id} className='text-white border-y border-white flex items-center gap-5 justify-start shadow-xl'>
            <div className='bg-white h-full items-center'>
              <h1 className="bg-white p-5 text-[rgb(22,22,22)] text-3xl font-bold whitespace-nowrap flex items-center gap-3">{item.timeValue} <span className='text-[rgb(22,22,22)] text-sm'>to</span> {item.timeValue2}</h1>
            </div>
            <div className='py-3'>
              <h1 className="text-white text-3xl font-bold break-all">{item.activity}</h1>
            </div>
          </div>
        ))}
      </section>

      <ActionButtons id={id}/>

      {/* <DeleteSched id={id}/> */}
    </div>
  )
}

export default page
