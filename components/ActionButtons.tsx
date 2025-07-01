"use client"

import { Dialog } from '@headlessui/react'
import { Pencil, Printer, Trash2, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { deleteSchedule } from '@/actions/deleteSchedule'

const ActionButtons = ({id}: {id: string}) => {
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();

    const handleModal = () => {
        setIsOpen(!isOpen);

        console.log(isOpen);
    }

    const handleDelete = async () => {
        console.log("This is delete function...")
    
        try {
            setIsOpen(false);            

            const result = await deleteSchedule(id);

            if(!result.success){
              console.error(result.error);
            }

            toast.success("Item Deleted");

            router.push('/dashboard');
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete item")
        }
    }
  return (
    <footer className='excludePrint mt-5 flex justify-center'>
      <div className='flex'>
        <button onClick={()=>handleModal()} className='bg-red-500 p-5 text-white font-bold rounded-bl-xl -translate-y-0.25 hover:translate-none cursor-pointer duration-200'>
          <Trash2 className='text-white'/>
        </button>

        <button type="button" onClick={()=>window.print()} className='bg-cyan-200 p-5 text-white font-bold -translate-y-0.25 hover:translate-none cursor-pointer duration-200'>
          <Printer className='text-[rgb(22,22,22)]'/>
        </button>

        <Link href={`/schedule/edit/${id}`} className='block bg-blue-500 p-5 text-white font-bold rounded-br-xl -translate-y-0.25 hover:translate-none cursor-pointer duration-200'>
          <Pencil className='text-white'/>
        </Link>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
            <div className='fixed inset-0 bg-black/30'></div>

            <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-5 max-sm:w-[90%] sm:w-[50%]">
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
