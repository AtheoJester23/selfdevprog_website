import { auth } from '@/auth'
import { client } from '@/sanity/lib/client';
import { AUTHOR_BY_GOOGLE_ID_QUERY, GOALS_BY_AUTHOR } from '@/sanity/lib/queries';
import { Goal, Quote } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'
import { userDeets } from './editProfile/page';
import Link from 'next/link';
import { goalDeets } from '../goal/page';

const page = async () => {
    const session = await auth();

    if(!session) redirect("/");

    const userDetails: userDeets = await client.fetch(AUTHOR_BY_GOOGLE_ID_QUERY, {id: session.id});
    const goalList: goalDeets[] = await client.fetch(GOALS_BY_AUTHOR, {id: session.id});

    const picked = goalList.filter(item => item.picked == true);

    console.log(picked);
  return (
    <article className='mt-[80px] flex flex-col gap-2'>
        <div className='flex flex-col justify-center items-center mx-5'>
            <Image src={`${session.user.image}`} alt={`Profile picture of ${session.user.email}`} className='mx-auto rounded-full border border-2 border-white w-[150px] h-[150px]' width={100} height={100}/>        
            <h1 className='text-white text-[34px] font-bold'>{userDetails.name != "" ? userDetails.name : "Unknown"}</h1>
        </div>

        <Link href={'/profile/editProfile'} className='border-gray rounded-full px-5 py-2 mx-auto font-bold text-white bg-[rgb(54,54,54)] hover:bg-[rgb(38,38,38)]'>
            Edit Profile
        </Link>
    
        <section className='bg-[rgb(16,16,16)] rounded p-5 flex justify-center items-center flex-col mx-auto relative'>
            <Quote className='w-[1em] text-gray-500' size="100%"/>
            <h3 className='text-gray-500'>Personal Quote:</h3>
            {userDetails.quote != "" ? (
                <p className='text-white'>
                    {
                        userDetails.quote 
                    }
                </p>
            ):(
                <p className='text-gray-500 font-bold'>
                    --Unknown--
                </p>
            )}
        </section>

        <section className='text-white bg-[rgb(16,16,16)] rounded p-5 flex justify-center items-center flex-col mx-5 gap-3 mb-5'>
            <div className='flex justify-center items-center flex-col'>
                <Goal className='w-[2em]' size="100%"/>
                <h1 className='text-[24px] font-bold'>4 most important goal:</h1>
            </div>
        
            {
                picked.length === 4 ? (
                    <ul className='fourGoals'>
                            <>
                                {picked.map((item, index) => (
                                    <Link href={`goal/${item._id}`} key={index} className={`flex justify-center items-center border p-5 text-center ${index == 0 ? "max-sm:rounded-tl-lg sm:rounded-s-lg" : index === picked.length - 1 ? "max-sm:rounded-br-lg sm:rounded-e-lg" : null} hover:text-[rgb(16,16,16)] hover:bg-white font-bold`}>
                                        {item.title}
                                    </Link>
                                ))}
                            </>
                    </ul>
                ) : (
                    <div className='flex justify-center items-center bg-'>
                        <Link href={`/profile/editProfile`} className={`flex justify-center items-center border p-5 text-center hover:text-[rgb(16,16,16)] hover:bg-white font-bold`}>
                            Pick Four Goals
                        </Link>
                    </div>
                ) 
            }
        </section>
    </article>
  )
}

export default page
