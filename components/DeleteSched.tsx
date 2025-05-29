"use client"

import React, { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { TriangleAlert } from 'lucide-react'
import { useAtom } from 'jotai'
import { modalDelete } from '@/atoms/actionAtoms'

const DeleteSched = (id: string) => {
    const[isOpen, setIsOpen] = useAtom(modalDelete);

    console.log(id);

  return (
    <>
        {/* <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
            <div className='fixed inset-0 bg-black/30'></div>

            <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-5 w-[50%]">
                    <div className='flex justify-center flex-col items-center gap-3'>
                        <TriangleAlert size={100} className='text-red-500'/>
                        <div>
                            <Dialog.Title className="text-2xl font-bold">Confirm Delete</Dialog.Title>
                            <Dialog.Description className="text-gray-500">This action is irreversible.</Dialog.Description>
                        </div>
                        <div className='flex gap-3'>
                            <button 
                                className='px-5 py-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600 duration-200 -translate-y-0.25 hover:translate-none shadow hover:shadow-none' 
                                onClick={() => {
                                    if(selectedDelete){
                                        handleDelete(selectedDelete.theIndex, selectedDelete.theId)
                                    }
                                }}>
                                    Yes
                            </button>
                            <button className='px-5 py-2 bg-gray-500 text-white rounded-full cursor-pointer hover:bg-gray-600 duration-200 -translate-y-0.25 hover:translate-none shadow hover:shadow-none' onClick={() => setIsOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>  */}

        <h1 className='text-white text-4xl'>Testing abcdefg</h1>
    </>
  )
}

export default DeleteSched
