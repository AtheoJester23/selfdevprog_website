"use client"

import { UpdateGoalPicks, UpdateUserDetails } from '@/actions/updateSchedule'
import { goalDeets } from '@/app/(root)/goal/page'
import { userDeets } from '@/app/(root)/profile/editProfile/page'
import { allAtomGoals } from '@/atoms/actionAtoms'
import { client } from '@/sanity/lib/client'
import { UPDATE_PICKED_GOALS } from '@/sanity/lib/queries'
import { useAtom } from 'jotai'
import Link from 'next/link'
import { useRouter} from 'next/navigation'
import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

const Profileform = ({userDetails, allGoals}: {userDetails: userDeets, allGoals: goalDeets[]}) => {
    const [emptyFields, setEmptyFields] = useState<string[]>([])
    const router = useRouter();
    const [isPending, setIsPending] = useState<boolean>(false);
    const [, setAtomGoals] = useAtom(allAtomGoals);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void>=> {
        e.preventDefault();
        
        setIsPending(true);

        console.log("Submit button pressed...")
    
        const form = e.currentTarget;
        const formData = new FormData(form);
        const empty: string[] = [];
        
        for(const[key, value] of formData.entries()){
            if(!value || (typeof value === "string" && value.trim() === "")){
                if(!key.includes("personalQuote")){
                    empty.push(key);
                }
            }
        }

        setEmptyFields(empty);

        const name = (document.getElementsByName("profileName")[0]) as HTMLInputElement
        const quote = (document.getElementsByName("personalQuote")[0]) as HTMLInputElement
        
        

        const newDetails: userDeets = {...userDetails, name: name.value, quote: quote.value};

        if(empty.length != 0){
            console.log(emptyFields)
            toast.error("Please fill in all required fields.");
            return;
        }

        const pickedGoals: string[] = formData.getAll("goals").filter((val): val is string => typeof val === "string");

        if(pickedGoals.length > 4){
            toast.error(`Oops... You can only pick four goals, remove ${pickedGoals.length - 4} ${pickedGoals.length - 4 === 1 ? "goal" : "goals"} to proceed.`)
            setIsPending(false);
            return;
        }else if(pickedGoals.length < 4){
            toast.error(`Oops... You're missing ${4 - pickedGoals.length} more ${4 - pickedGoals.length == 1 ? "goal" : "goals"}`)
            setIsPending(false);
            return;
        }

        const currentPicks = allGoals.filter(item => item.picked === true).map(item => item.title);

        try {
            // Check if there's existing picked top four goals
            if(currentPicks.length > 0){
                console.log("There is existing picks");

                const selectedGoals: goalDeets[] = await client.fetch(UPDATE_PICKED_GOALS, {titles: currentPicks});

                console.log(selectedGoals);

                UpdateGoalPicks(selectedGoals, false);
            }

            // Change the 'picked' of each goal to true that is selected in the checkbox
            console.log("selected goals: ", pickedGoals);

            const goals: goalDeets[] = await client.fetch(UPDATE_PICKED_GOALS, { titles: pickedGoals});

            console.log(goals);

            UpdateGoalPicks(goals, true);

            const response = await UpdateUserDetails(userDetails.id, newDetails);
            
            if(!response){
                throw new Error(response);
            }

            const updatedPick = allGoals.map(item => ({
                ...item,
                picked: pickedGoals.includes(item.title) ? true : false
            }));  

            setAtomGoals(updatedPick);

            router.push('/profile');
        } catch (error) {
            console.error(error)
        }finally{
            setEmptyFields([]);
            setIsPending(false);
        }
    }

  return (
    <form onSubmit={(e) => handleSubmit(e)} id='profileForm' className='flex flex-col gap-5'>
        <div className='flex flex-col'>
            <label htmlFor="profileName" className='font-bold text-[1em] text-white'>Name *</label>
            <input id='profileName' name='profileName' defaultValue={userDetails.name} placeholder='Enter a name you&apos;d like to go by' type="text" className='bg-gray-50 border leading-none border-gray-300 text-gray-900 text-[1em] max-sm:rounded-sm sm:rounded focus:ring-blue-500 focus:border-blue-500 block w-full max-sm:p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' autoComplete='off'/>
            {emptyFields.find(error => error === "profileName") && 
                <small className='text-red-500 mt-1'>This field is required</small>
            }
        </div>
        
        <div className='flex flex-col'>
            <label htmlFor="personalQuote" className='font-bold text-[1em] text-white'>Personal Quote</label>
            <textarea id='personalQuote' name='personalQuote' defaultValue={userDetails.quote ?? ""} placeholder='What quote do you live by?' className='bg-gray-50 border leading-none border-gray-300 text-gray-900 text-[1em] max-sm:rounded-sm sm:rounded focus:ring-blue-500 focus:border-blue-500 block w-full max-sm:p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' autoComplete='off'/>
        </div>
        

        <fieldset className='bg-[rgb(23,23,23)] p-5 rounded-lg h-64 overflow-y-auto'>
            <legend className='text-white font-bold'>Select 4 most important goals</legend>
            {allGoals.length >= 4 ? (
                <div className='flex flex-col gap-3'>
                    {allGoals.map((item, index) => (
                        <label key={index} className="flex items-center gap-2 text-white border border-gray-500 rounded-lg p-3">
                            <input type="checkbox" name="goals" value={`${item.title}`} defaultChecked={item.picked}/>
                            {item.title}
                        </label>  
                    ))}
                </div>
            ): allGoals.length > 0 && allGoals.length < 4 ? (
                <div className='flex justify-center items-center flex-col gap-3 h-full'>
                    <Link href={`/goal/newGoal`} className='bg-green-500 text-[rgb(22,22,22)] py-2 px-3 rounded font-bold -translate-y-0.25 hover:translate-none duration-200 cursor-pointer shadow-xl hover:shadow-none'>
                        Add Goal
                    </Link>
                    <div className='flex justify-center flex-col items-center'>
                        <h1 className='text-gray-500 text-lg'>There&apos;s only {allGoals.length} {allGoals.length > 1 ? "goals" : "goal"}, add {4 - allGoals.length} more to proceed</h1>
                    </div>
                </div>
            ) : (
                <div className='flex justify-center items-center flex-col gap-3 h-full'>
                    <Link href={`/goal/newGoal`} className='bg-green-500 text-[rgb(22,22,22)] py-2 px-3 rounded font-bold -translate-y-0.25 hover:translate-none duration-200 cursor-pointer shadow-xl hover:shadow-none'>
                        Add Goal
                    </Link>
                    <div className='flex justify-center flex-col items-center'>
                        <h1 className='text-gray-500 text-lg font-bold'>No goal yet...</h1>
                    </div>
                </div>
            )}
        </fieldset>

        <button disabled={isPending} type='submit' className={`${!isPending ? "cursor-pointer bg-blue-500" : "bg-blue-400"} py-2 px-5 mx-auto font-bold text-white rounded`}>Submit</button>
            
        <ToastContainer theme='dark'/>
    </form>
  )
}

export default Profileform
