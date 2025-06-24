"use client"

import React, { useState } from 'react'
import { goalType } from './Goalform'
import { Check, Pencil, RefreshCcw, Trash2, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteSchedule } from '@/actions/deleteSchedule';
import { toast, ToastContainer } from 'react-toastify';
import { UpdateGoalStatus } from '@/actions/updateSchedule';
import { Dialog } from '@headlessui/react';
import { fireworkConfetti } from '../ui/fireworkConfetti';

const GoalPage = ({goalDeets, id}: {goalDeets: goalType[], id: string}) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [delIsPending, setDelIsPending] = useState(false);
    const [data, setData] = useState(goalDeets ?? [])

    console.log("This is data: ", data);

    const handleModal = () => {
        setIsOpen(!isOpen);
    }
    
    const handleDelete = async () => {
        setIsOpen(false);
        setDelIsPending(true);

        try {
            const result = await deleteSchedule(id)

            if(!result.success){
                throw new Error(result.error);
            }

            toast.success("Item Deleted");
            
            router.push('/goal');
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete item")
        }finally{
            setDelIsPending(false);
        }
    }
  
      const handleUpdateStats = async () => {
          const updated = {...data[0], status: !data[0].status};
          
          setData([updated]);
          setIsPending(true);
          if(updated.status == true){
            fireworkConfetti();
          }

          try {
              const result = await UpdateGoalStatus(id, data[0], !data[0].status);
  
              if(!result.success){
                  throw new Error(result.error)
              }
  
              toast.success(`${data[0].status ? "Keep moving forward!" : "Congrats!!"}`)

          } catch (error) {
            toast.error(`${error}`)
          }finally{
            setIsPending(false);
          }
      }

  return (
    <>
        <article className='mt-20 p-5 m-5 text-[16px] flex flex-col gap-3'>
            <h1 className='text-white font-bold max-sm:text-[2em] sm:text-[4em] text-center border-y'>{data[0].title}</h1>
            <div className='flex flex-col justify-center items-center mx-auto'>
                <small className='bg-yellow-500 rounded font-bold max-sm:px-3 max-sm:py-1  sm:px-5 sm:py-2 text-[rgb(22,22,22)] max-sm:text-[12px] sm:text-sm'>Accomplish by: {data[0].duration != "" ? data[0].duration : "Undecided"}</small>
                <p className='text-white mt-2'>Status: <span className={`${data[0].status ? "text-green-500 font-bold" : "text-gray-500"}`}>{data[0].status ? "Accomplished" : "To be accomplished"}</span></p>
            </div>

            <h1 className='text-[1em] text-[rgb(22,22,22)] bg-white text-center p-3'>{data[0].description}</h1>
            
            <section className='bg-[rgb(16,16,16)] p-5 flex justify-center rounded-b-xl'>
                <div className='flex flex-col gap-2'>
                <h1 className='text-white font-bold max-sm:text-[20px] max-sm:text-center sm:text-[2em]'>How You&apos;ll Make This Happen:</h1>

                
                {data[0].steps.length != 0 ? (
                    <ul className='flex flex-col max-sm:gap-5'>
                        {
                        data[0].steps.map((item, index) => (
                            <li key={index} className='max-sm:mx-[20px]'>
                                <p className='text-white sm:indent-8'>&bull; {item.step}</p>
                            </li>
                        ))
                        }
                    </ul>
                ):(
                    <>
                        <p className='text-center text-gray-500 text-center'>No steps yet — unless doing nothing is part of the plan 😉</p>
                    </>
                )}
                </div>
                
                
            </section>
        </article>
        
        <footer>
            <div className='flex justify-center items-center gap-2'>
                <button disabled={delIsPending} onClick={()=>handleModal()} className={`${!delIsPending ? "bg-red-500 hover:translate-none" : "bg-red-400"} p-3 rounded-bl-xl -translate-y-0.5 duration-200 cursor-pointer`}>
                    <Trash2/>
                </button>
                <button disabled={isPending} onClick={()=>handleUpdateStats()} className={`${data[0].status ? (!isPending ? "bg-blue-500 hover:translate-none" : "bg-blue-300") : (!isPending ? "bg-green-500 hover:translate-none" : "bg-green-300")} p-3 -translate-y-0.5 duration-200 cursor-pointer` }>
                    {data[0].status ? (
                        <RefreshCcw/>
                    ):(
                        <Check/>
                    )}
                </button>
                <Link href={`/goal/edit/${id}`} className='bg-blue-500 p-3 rounded-br-xl -translate-y-0.5 hover:translate-none duration-200 cursor-pointer'>
                    <Pencil/>
                </Link>
            </div>
        </footer>
        <ToastContainer theme='dark'/>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
            <div className='fixed inset-0 bg-black/30'></div>

            <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-5 w-[50%]">
                    <div className='flex justify-center flex-col items-center gap-3'>
                        <TriangleAlert size={100} className='text-red-500'/>
                        <div className='text-center'>
                            <Dialog.Title className="text-2xl font-bold">Are you sure?</Dialog.Title>
                            <Dialog.Description className="text-gray-500">Warning: This action cannot be undone.</Dialog.Description>
                        </div>
                        <div className='flex gap-3'>
                            <button 
                                className='px-5 py-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600 duration-200 -translate-y-0.25 hover:translate-none shadow hover:shadow-none' 
                                onClick={() => handleDelete()}>
                                    Yes
                            </button>
                            <button className='px-5 py-2 bg-gray-500 text-white rounded-full cursor-pointer hover:bg-gray-600 duration-200 -translate-y-0.25 hover:translate-none shadow hover:shadow-none' onClick={() => setIsOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    </>
  )
}

export default GoalPage
