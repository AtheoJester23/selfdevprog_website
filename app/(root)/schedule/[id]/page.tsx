import { auth } from '@/auth';
import ActionButtons from '@/components/ActionButtons';
import { Entry } from '@/components/Addtime';
import { to12Hour } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { SCHEDULE_BY_ID } from '@/sanity/lib/queries';
import { redirect } from 'next/navigation';
import React from 'react'

export interface scheds{
  title: string,
  _id: string,
  _createdAt: string,
  user: {
    _id: string,
    image: string,
    name: string,
  },
  allTime: Entry[];
}

type Params = Promise<{id: string}>

export default async function(prop: { params: Params }){
  const session = await auth();

  if(!session) redirect('/');

  console.log(session.user.name);

  const { id } = await prop.params

  const schedule: scheds[] = await client.fetch(SCHEDULE_BY_ID, {id});

  console.log(schedule);

  return (
    <div className='mt-[80px] p-5 printable-area'>
      <h1 className="text-white text-5xl font-bold mb-[30px] text-center theTitle">{schedule[0].title}</h1>
      
      <section className='flex flex-col gap-3'>
        {schedule[0].allTime.map((item: Entry) => (
          <div key={item.id} className='text-white border-y border-white flex items-center gap-5 justify-start shadow-xl'>
            <div className='time bg-white h-full items-center'>
              <h1 className="bg-white p-5 text-[rgb(22,22,22)] text-3xl font-bold whitespace-nowrap flex items-center gap-3">{to12Hour(item.timeValue)} <span className='text-[rgb(22,22,22)] text-sm'>to</span> {to12Hour(item.timeValue2)}</h1>
            </div>
            <div className='py-3 action'>
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
