"use client"

import { UpdateUserDetails } from '@/actions/updateSchedule'
import { goalDeets } from '@/app/(root)/goal/page'
import { userDeets } from '@/app/(root)/profile/editProfile/page'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

const Profileform = ({userDetails, allGoals}: {userDetails: userDeets, allGoals: goalDeets[]}) => {
    const [emptyFields, setEmptyFields] = useState<string[]>([])
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void>=> {
        e.preventDefault();
        
        console.log("Submit button pressed...")
    
        const form = e.currentTarget;
        const formData = new FormData(form);
        const empty: string[] = [];

        const pickedGoals: string[] = formData.getAll("goals").filter((val): val is string => typeof val === "string");

        console.log("selected goals: ", pickedGoals);
        
        const fourGoals: goalDeets[] = pickedGoals.map(item => allGoals.find(goal => goal.title === item)).filter((goal): goal is goalDeets => goal !== undefined);

        for(const[key, value] of formData.entries()){
            if(!value || (typeof value === "string" && value.trim() === "")){
                if(!key.includes("step")){
                    empty.push(key);
                }
            }
        }

        setEmptyFields(empty);

        const name = (document.getElementsByName("profileName")[0]) as HTMLInputElement
        const quote = (document.getElementsByName("personalQuote")[0]) as HTMLInputElement
        const newDetails: userDeets = {...userDetails, name: name.value, quote: quote.value, goals: fourGoals};
        
        console.log(newDetails);

        console.log("")

        console.log(userDetails);

        if(empty.length != 0){
            console.log(emptyFields)
            toast.error("Please fill in all required fields.");
            return;
        }

        if(pickedGoals.length > 4){
            toast.error(`Oops... You can only pick four goals, remove ${pickedGoals.length - 4} ${pickedGoals.length - 4 === 1 ? "goal" : "goals"} to proceed.`)
            return;
        }else if(pickedGoals.length < 4){
            toast.error(`Oops... You're missing ${4 - pickedGoals.length} more ${4 - pickedGoals.length == 1 ? "goal" : "goals"}`)
            return;
        }


        try {
            const response = await UpdateUserDetails(userDetails.id, newDetails);

            if(!response){
                throw new Error(response);
            }

            router.push('/profile');
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <form onSubmit={(e) => handleSubmit(e)} id='profileForm' className='flex flex-col gap-5'>
        <div className='flex flex-col'>
            <label htmlFor="profileName" className='font-bold text-[1em] text-white'>Name:</label>
            <input id='profileName' name='profileName' defaultValue={userDetails.name} placeholder='Enter a name you&apos;d like to go by' type="text" className='bg-gray-50 border leading-none border-gray-300 text-gray-900 text-[1em] max-sm:rounded-sm sm:rounded focus:ring-blue-500 focus:border-blue-500 block w-full max-sm:p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' autoComplete='off'/>
            {emptyFields.find(error => error === "profileName") && 
                <small className='text-red-500 mt-1'>This field is required</small>
            }
        </div>
        
        <div className='flex flex-col'>
            <label htmlFor="personalQuote" className='font-bold text-[1em] text-white'>Personal Quote:</label>
            <textarea id='personalQuote' name='personalQuote' defaultValue={userDetails.quote ?? ""} placeholder='What quote do you live by?' className='bg-gray-50 border leading-none border-gray-300 text-gray-900 text-[1em] max-sm:rounded-sm sm:rounded focus:ring-blue-500 focus:border-blue-500 block w-full max-sm:p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' autoComplete='off'/>
            {emptyFields.find(error => error === "personalQuote") && 
                <small className='text-red-500 mt-1'>This field is required</small>
            }
        </div>
        

        <fieldset className='bg-[rgb(23,23,23)] p-5 rounded-lg h-64 overflow-y-auto'>
            <legend className='text-white font-bold'>Select 4 most important goals</legend>
            {allGoals.length >= 4 ? (
                <div className='flex flex-col gap-3'>
                    {allGoals.map((item, index) => (
                        <label key={index} className="flex items-center gap-2 text-white border border-gray-500 rounded-lg p-3">
                            <input type="checkbox" name="goals" value={`${item.title}`} />
                            {item.title}
                        </label>  
                    ))}
                </div>
            ):(
                <p>No goals yet... add some?</p>
            )}
        </fieldset>

        <button type='submit' className='cursor-pointer bg-blue-500 py-2 px-5 mx-auto font-bold text-white rounded'>Submit</button>
            
        <ToastContainer theme='dark'/>
    </form>
  )
}

export default Profileform
