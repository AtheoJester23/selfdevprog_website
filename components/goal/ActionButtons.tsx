"use client"

import { deleteSchedule } from '@/actions/deleteSchedule';
import { UpdateGoalStatus } from '@/actions/updateSchedule';
import { Dialog } from '@headlessui/react'
import { Check, Pencil, RefreshCcw, Trash2, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { goalType } from './Goalform';

const ActionButtons = ({id, data}: {id: string, data: goalType}) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleModal = () => {
        setIsOpen(!isOpen);
    }

    const handleDelete = async () => {
        setIsOpen(false);

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
        }
    }

    const handleUpdateStats = async () => {
        console.log(data);
        
        try {
            const result = await UpdateGoalStatus(id, data, !data.status);

            if(!result.success){
                throw new Error(result.error)
            }

            toast.success(`${data.status ? "Congrats!!" : "Lets Go!"}`)
        } catch (error) {
            toast.error(`${error}`)
        }
    }

  return (
    <footer>
        <div className='flex justify-center items-center gap-2'>
            <button onClick={() => handleModal()} className='bg-red-500 p-3 rounded-bl-xl -translate-y-0.5 hover:translate-none duration-200 cursor-pointer'>
                <Trash2/>
            </button>
            <button onClick={() => handleUpdateStats()} className={`${data.status ? "bg-blue-500" : "bg-green-500"} p-3 -translate-y-0.5 hover:translate-none duration-200 cursor-pointer`}>
                {data.status ? (
                    <RefreshCcw/>
                ):(
                    <Check/>
                )}
            </button>
            <Link href={`/goal/edit/${id}`} className='bg-blue-500 p-3 rounded-br-xl -translate-y-0.5 hover:translate-none duration-200 cursor-pointer'>
                <Pencil/>
            </Link>
        </div>

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
    </footer>
  )
}

export default ActionButtons
