"use client"

import { UpdateGoal } from '@/actions/updateSchedule';
import { goalDeets } from '@/app/(root)/goal/page';
import { allAtomGoals } from '@/atoms/actionAtoms';
import { createGoal } from '@/lib/actions';
import { client } from '@/sanity/lib/client';
import { GOALS_BY_AUTHOR } from '@/sanity/lib/queries';
import { goalFormSchema } from '@/sanity/lib/validation';
import { useAtom } from 'jotai';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { z } from 'zod'

export type goalType = {
  _id?: string,
  title: string,
  duration: string,
  description: string,
  status: boolean,
  picked: boolean,
  steps: {
    _key: string,
    step: string,
    status: string
  }[]
}

const Goalform = ({data, id, create, session_id}: {data: goalType[] | null, id: string | null, create: boolean, session_id: string}) => {
  const [how, setHow] = useState<Array<{_key: string, step: string, status: string}>>(data?.[0]?.steps && !create ? data?.[0].steps : []);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter()
  const [emptyFields, setEmptyFields] = useState<string[]>([])
  const [isPending , setIsPending] = useState<boolean>(false);
  const [atomGoals, setAtomGoals] = useAtom(allAtomGoals);

  console.log(session_id);

  const handleCancel = () => {
    const cancelLast = how.filter(item => item.status != "Empty")

    setHow(cancelLast)
  }

  const handleAddHow = (theIndex?: number) => {    
    const theStep = (document.getElementsByName(`step${theIndex}`)[0]) as HTMLInputElement;
    
    if(!theStep?.value && how[theIndex!]?.status == "Empty"){
      toast.error("Please fill out this field before continuing.")
      return;
    } 

    setTimeout(()=>{
        inputRef.current?.focus();
    }, 100)

    if(how.length === 0){
      setHow([{_key: nanoid(), step: "", status: "Empty"}]);
    }else{
      const newHowList = how.map((item, index) => theIndex == index ? {_key: nanoid(),step: theStep.value, status: "Done"} : item);
      newHowList.push({_key: nanoid() ,step: "", status: "Empty"})
      setHow(newHowList);


      console.log(how);
    }
  }

  const handleEdit = (theIndex:number) => {
    const selected = how[theIndex].status;

    if(selected == "Done"){
      const enableEdit = how.map((item, index) => theIndex == index ? {...item, status: "Edit"} : item);
  
      setHow(enableEdit);
    }else if(selected == "Edit"){
      const doneEdit = how.map((item, index) => theIndex == index ? {...item, status: "Done"} : item)

      setHow(doneEdit);
    }
  }

  const handleProceedEdit = (theIndex: number) => {
    const theStep = (document.getElementsByName(`step${theIndex}`)[0]) as HTMLInputElement;
    
    if(!theStep.value){
      toast.error("Please fill out this field before continuing.")
    }else{
      const edited = how.map((item, index) => theIndex == index ? {...item, step: theStep.value, status: "Done"} : item);

      setHow(edited)
    }
  }

  const handleDelete = (theIndex: number) => {
    const filterOut = how.filter((_, index) => theIndex != index);
    setHow(filterOut);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const empty: string[] = [];
    
    for(const [key, value] of formData.entries()){
      if(!value || (typeof value === "string" && value.trim() === "")){
        if(!key.includes("step")){
          empty.push(key);
        }
      }
    }

    if(!empty.length){
      console.log("All Goods...");
    }else{
      setEmptyFields(empty);
      console.log("There's these blank: ", empty);
      return;
    }
    
    const goalName = (document.getElementsByName("title")[0]) as HTMLInputElement;
    const duration = (document.getElementsByName("duration")[0]) as HTMLSelectElement;
    const description = (document.getElementById("description")) as HTMLTextAreaElement;
    const allSteps = how.filter(item => item.status != "Empty" && item.status != "Edit")

    setIsPending(true)

    try {
      // I changed this from "goalType" to "goalDeets"
      const allData: goalDeets = {_id: nanoid(), title: goalName.value, duration: duration.value, description: description.value, status: false, steps: allSteps, picked: false}
  
      atomGoals.push(allData);

      setAtomGoals(atomGoals);

      // also added _id in this one:
      await goalFormSchema.parseAsync(allData);

      const result = await createGoal(allData);

      if(result.error.trim() != ""){
        throw result.error;
      }

      router.push(`/goal/${result._id}`);
    
      
      toast.success("Schedule Created");
      
    } catch (error) {
      if(error instanceof z.ZodError){
        const fieldErrs = error.flatten().fieldErrors;

        const theError = fieldErrs as unknown as Record<string, string>
        
        toast.error(`${theError.title}`);
      }else{
        toast.error((error as Error).message);
      }
    }finally{
      setIsPending(false)
    }

  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>): Promise<void>  => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const empty: string[] = [];

    for(const[key, value] of formData.entries()){
      if(!value || (typeof value === "string" && value.trim() === "")){
        if(!key.includes("step")){
          empty.push(key);
        }
      }
    }

    setEmptyFields(empty);

    if(empty.length === 0){
      console.log("All goods")
    }else{
      

      console.log("Empty fields: ", empty);
      toast.error("Please fill in all required fields.");
      return;
    }

    const goalName = (document.getElementsByName("title")[0]) as HTMLInputElement;
    const duration = (document.getElementsByName("duration")[0]) as HTMLSelectElement;
    const description = (document.getElementById("description")) as HTMLTextAreaElement;
    const allSteps = how.filter(item => item.status != "Empty" && item.status != "Edit")

    setIsPending(true)

    try {
      const allData: goalDeets = {_id: data?.[0]._id, title: goalName.value, duration: duration.value, description: description.value, status: false, steps: allSteps, picked: data?.[0]?.picked ?? false}
  
      const allGoals: goalDeets[] = await client.fetch(GOALS_BY_AUTHOR, {id: session_id});

      const updatedData = allGoals.map(item => item._id == id ? {...item, ...allData} : item);

      setAtomGoals(updatedData);

      await goalFormSchema.parseAsync(allData);

      const result = await UpdateGoal(id!, allData);
      
      if(!result.success){
        throw new Error(result.error)
      }

      toast.success("Updated Successfully...")

      router.push(`/goal/${id}`);
    } catch (error) {
      console.error(error);
      toast.error("Update failed")
    }finally{
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={(e)=> data && !create ? handleUpdate(e) : handleSubmit(e)} id="goalForm" className='flex flex-col p-5 m-5 gap-7 text-[16px]'>
      <div className='flex flex-col gap-1'>
        <label htmlFor="title" className='text-white max-sm:text-[20px] sm:text-[24px] font-bold'>Goal*</label>
        <input 
          type="text"
          defaultValue={data?.[0]?.title && !create ? data?.[0]?.title : ""} 
          id='title' 
          name='title' 
          className='
            bg-gray-50 
            border 
            leading-none 
            border-gray-300 
            text-gray-900
            text-[1em]
            max-sm:rounded-sm 
            sm:rounded 
            focus:ring-blue-500 
            focus:border-blue-500 
            block 
            w-full
            max-sm:p-2 
            sm:p-2.5 
            dark:bg-gray-700 
            dark:border-gray-600 
            dark:placeholder-gray-400 
            dark:text-white 
            dark:focus:ring-blue-500 
            dark:focus:border-blue-500" 
          '
          autoFocus
          placeholder='What is the goal?'
          aria-required="true"
        /> 
        {emptyFields?.find(item => item === "title") && <small className="text-red-400 text-sm">This field is required.</small>}
      </div>

      <div className='flex flex-col gap-1'>
        <label htmlFor="duration" className='text-white font-bold max-sm:text-[20px] sm:text-[24px]'>Duration</label>
        <select 
          name="duration" 
          defaultValue={data?.[0]?.duration && !create ? data?.[0].duration : ""} 
          id="duration" 
          className='
            bg-gray-50 
            border 
            leading-none 
            border-gray-300 
            text-gray-900
            text-[1em]
            max-sm:rounded-sm 
            sm:rounded 
            focus:ring-blue-500 
            focus:border-blue-500  
            w-full
            max-sm:p-2 
            sm:p-2.5 
            dark:bg-gray-700 
            dark:border-gray-600 
            dark:placeholder-gray-400 
            dark:text-white 
            dark:focus:ring-blue-500 
            dark:focus:border-blue-500" 
          '
        >
            <option value="" disabled>-- How long will it take to achieve this goal? --</option>
            <option value="1 year">1 year</option>
            <option value="3 years">3 years</option>
            <option value="5 years">5 years</option>
            <option value="10 years">10 years</option>
        </select>
      </div>

      <div className='flex flex-col gap-1'>
        <label htmlFor='description' className='text-white font-bold max-sm:text-[20px] sm:text-[24px]'>Description*</label>
        <textarea 
          id="description" 
          name="description"
          rows={data?.[0]?.description ? 7 : 3}
          defaultValue={data?.[0]?.description && !create ? data?.[0]?.description : ""} 
          placeholder='What is the purpose of this goal? / Why do you want to achieve this goal?' 
          className='
            bg-gray-50 
            border 
            leading-none 
            border-gray-300 
            text-gray-900
            text-[1em]
            max-sm:rounded-sm 
            sm:rounded 
            focus:ring-blue-500 
            focus:border-blue-500 
            block 
            w-full
            max-sm:p-2 
            sm:p-2.5 
            dark:bg-gray-700 
            dark:border-gray-600 
            dark:placeholder-gray-400 
            dark:text-white 
            dark:focus:ring-blue-500 
            dark:focus:border-blue-500" 
          '
          aria-required="true"
        />
        {emptyFields?.find(item => item === "description") && <small className="text-red-400 text-sm">This field is required.</small>}
      </div>

      <section className='bg-[rgb(16,16,16)] p-5 flex flex-col gap-2'>
        <h1 className='text-white font-bold max-sm:text-[20px] sm:text-[24px] text-center mb-2'>How can you achieve this goal?</h1>
        
        {how.length === 0 ? (
          <div className='mx-auto flex justify-center flex-col'>
            <button onClick={()=>handleAddHow()} type='button' className='bg-green-500 text-[rgb(22,22,22)] font-bold px-3 py-2 rounded -translate-y-1 hover:translate-none duration-200 cursor-pointer'>
              Add Step
            </button>
            <p className='text-gray-500'>There&apos;s no step yet...</p>
          </div>
        ):(
          <ul className='flex flex-col gap-2 sm:mx-10'>
            {how.map((item, index) => item.status != "Done" ? (
              <li className='flex max-sm:flex-col justify-center sm:items-center gap-3 text-white border-y border-gray-500 p-4' key={index}>
                  <div className='flex flex-1 gap-2 items-center'>
                      <span className='text-white text-[20px]'>&bull;</span>
                      <input
                        ref={inputRef}
                        type="text"
                        name={`step${index}`}
                        defaultValue={item.step ?? ""}
                        onKeyDown={(e)=>{
                          if(e.key === "Enter"){
                            if(item.status == "Empty"){
                              handleAddHow(index);
                            }else{
                              handleProceedEdit(index)
                            }
                          }
                        }} 
                        className='
                          bg-gray-50 
                          border 
                          leading-none 
                          border-gray-300 
                          text-gray-900
                          text-[1em]
                          max-sm:rounded-sm 
                          sm:rounded 
                          focus:ring-blue-500 
                          focus:border-blue-500 
                          block 
                          w-full
                          max-sm:p-1 
                          sm:p-2.5 
                          dark:bg-gray-700 
                          dark:border-gray-600 
                          dark:placeholder-gray-400 
                          dark:text-white 
                          dark:focus:ring-blue-500 
                          dark:focus:border-blue-500" 
                        '
                        placeholder='Enter your thought...'
                        autoComplete='off'
                      />
                  </div>

                  <div className='flex items-center max-sm:gap-1 sm:gap-2'>
                      {item.status == "Empty" ? (
                        <>
                          <button onClick={()=>handleAddHow(index)} type='button' className='px-2 bg-green-400 p-2 max-sm:rounded-sm sm:rounded-xl -translate-y-0.5 hover:translate-none duration-200 cursor-pointer h-full max-sm:w-full flex justify-center'>
                              <Check className='text-[rgb(22,22,22)]'/>
                          </button>
                          <button onClick={()=>handleCancel()} type='button' className='px-2 bg-red-500 p-2 max-sm:rounded-sm sm:rounded-xl -translate-y-0.5 hover:translate-none duration-200 cursor-pointer h-full max-sm:w-full flex justify-center'>
                              <X className='text-[rgb(22,22,22)]'/>
                          </button>
                        </>
                      ):(
                        <>
                          <button onClick={()=>handleProceedEdit(index)} type='button' className='px-2 bg-green-400 p-2 max-sm:rounded-sm sm:rounded-xl -translate-y-0.5 hover:translate-none duration-200 cursor-pointer h-full max-sm:w-full flex justify-center'>
                              <Check className='text-[rgb(22,22,22)]'/>
                          </button>
                          <button onClick={()=>handleEdit(index)} type='button' className='px-2 bg-red-500 p-2 max-sm:rounded-sm sm:rounded-xl -translate-y-0.5 hover:translate-none duration-200 cursor-pointer h-full max-sm:w-full flex justify-center'>
                              <X className='text-[rgb(22,22,22)]'/>
                          </button>
                        </>
                      )}
                  </div>
                </li>
            ):(
              <li key={index} className='flex max-sm:flex-col max-sm:gap-4 sm:justify-between py-3 border-y border-gray-500 flex sm:items-center'>
                <h3 className='text-white text-[20px] break-all'>&bull; {item.step}</h3>
                <div className='flex sm:items-center max-sm:gap-1 sm:gap-2'>
                  <button onClick={()=>handleEdit(index)} type='button' className='px-2 bg-blue-500 p-2 max-sm:rounded-sm sm:rounded-xl -translate-y-0.5 hover:translate-none duration-200 cursor-pointer h-full max-sm:w-full flex justify-center'>
                      <Pencil className='text-[rgb(22,22,22)]'/>
                  </button>
                  <button onClick={()=>handleDelete(index)} type='button' className='px-2 bg-red-500 p-2 max-sm:rounded-sm sm:rounded-xl -translate-y-0.5 hover:translate-none duration-200 cursor-pointer h-full max-sm:w-full flex justify-center'>
                      <Trash2 className='text-[rgb(22,22,22)]'/>
                  </button>
              </div>
              </li>
            ))}
          </ul>
        )}
        {how[how.length -1]?.status == "Done" && (
          <button onClick={()=>handleAddHow()} type='button' className='border py-2 text-white rounded font-bold text-[1em] duration-200 cursor-pointer hover:bg-white hover:text-[rgb(16,16,16)] my-2 flex justify-center items-center sm:mx-10'>
            <Plus className='w-[20px]' size="100%"/>
            <span>
              Add
            </span>
          </button>
        )}
      </section>
      
      {data && !create ? (
        <button disabled={isPending} type='submit' className={`${isPending ? "bg-blue-400" : "bg-blue-500 hover:translate-none"} py-2 text-[rgb(22,22,22)] rounded font-bold max-sm:text-[1em] sm:text-[24px] -translate-y-0.5 duration-200 shadow hover:shadow-none cursor-pointer`}>Update</button>     
      ):(
        <button disabled={isPending} type='submit' className={`${isPending ? "bg-green-300" : "bg-green-500 hover:translate-none"} py-2 text-[rgb(22,22,22)] rounded font-bold max-sm:text-[1em] sm:text-[24px] -translate-y-0.5 duration-200 shadow hover:shadow-none cursor-pointer`}>Create</button>     
      )}
      <ToastContainer theme='dark'/>
    </form>
  )
}

export default Goalform
