"use client"

import { to12Hour } from '@/lib/utils';
import { Clock, Plus } from 'lucide-react';
import React, { forwardRef, useImperativeHandle, useRef } from 'react'

type TimeBlockProps = {
  item: {
    id: number;
    timeValue: string;
    timeValue2: string;
    activity: string;
    // ...add other properties if needed
  };
  index: number;
  handleTest: (index: number, id: number) => void;
};

export type TimeBlockHandle = {
  getValues: () => {
    time: string;
    nextTime: string;
    activity: string;
  };
};

const AddNewTime = forwardRef<TimeBlockHandle, TimeBlockProps>(
    ({ item, index, handleTest }, ref) => {
            const inputTimeRef = useRef<HTMLInputElement>(null);
            const inputNextTimeRef = useRef<HTMLInputElement>(null);
            const inputActivityRef = useRef<HTMLInputElement>(null);

            useImperativeHandle(ref, () => ({
                getValues: () => ({
                    time: inputTimeRef.current?.value || '',
                    nextTime: inputNextTimeRef.current?.value || '',
                    activity: inputActivityRef.current?.value || '',
                }),
            }));

    return (
        <>
            <h1 className='text-white whitespace-nowrap'>{to12Hour(item.timeValue)}</h1>

            <h1 className='text-white font-bold'>to</h1>

            <div className='relative'>
                <input
                    ref={inputNextTimeRef} 
                    type="time" 
                    id={`nextInput${index}`} 
                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    defaultValue={item.timeValue2} 
                    onKeyDown={(e)=>{
                        if(e.key === "Enter"){
                            e.preventDefault();
                            handleTest(index, item?.id);
                        }
                    }}
                    required 
                />
                <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                    <Clock className='text-white' size={20}/>
                </div>
            </div>

            <h1 className='text-white font-bold'>:</h1>

            <input
                ref={inputActivityRef} 
                autoFocus
                id={`activity${index}`} 
                type="text" 
                className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                defaultValue={item.activity} 
                autoComplete='off' 
                onKeyDown={(e)=>{
                    if(e.key === "Enter"){
                        e.preventDefault();
                        handleTest(index, item?.id);
                    }
                }}
                required
                placeholder='What will you be doing abcdefg during this time?'  
            />

            <button onClick={()=>handleTest(index, item?.id)} type='button' className='bg-green-400 p-2 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                <Plus className='text-[rgb(22,22,22)]'/>
            </button>
        </>
    )
    }
)

export default AddNewTime
