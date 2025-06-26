"use client"

import { goalDeets } from '@/app/(root)/goal/page'
import { allGoals} from '@/atoms/actionAtoms'
import { useAtom} from 'jotai'
import { Circle, Plus, PlusCircle, Search } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const GoalItems = ({data}: {data: goalDeets[]}) => {
    const [goals, setGoals] = useAtom(allGoals);
    const [searchData, setSearchData] = useState<goalDeets[]>(goals ?? []) 
    const [notFound, setNotFound] = useState<boolean>(false);

    useEffect(() => {
        if(goals.length === 0 && data.length > 0 && !notFound){
            setGoals(data);
            setSearchData(data);
        }
    }, [data, goals, setGoals, notFound]);

    // console.log("the Goals:", goals);
    

    const handleSearch = (searched: string | null) => {
        if(searched){
            setNotFound(false);
            const result = []
            
            for(let i = 0; i < searchData.length; i++){
                if(searchData[i].title.toLowerCase().replace(/\s+/g,"").includes(searched.toLocaleLowerCase().replace(/\s+/g, ""))){
                    result.push(searchData[i]);
                }
            }
    
            if(result.length > 0){
                setGoals(result)
            }else{
                setGoals([]);
                setNotFound(true);
    
            }
            console.log(notFound);
        }else{
            setNotFound(false);

            const searchBar = (document.getElementsByName("searchBar")[0]) as HTMLInputElement
            const result: goalDeets[] = []

            for(let i = 0; i < searchData.length; i++){
                if(searchData[i].title.toLocaleLowerCase().replace(/\s+/g, "").includes(searchBar.value.toLocaleLowerCase().replace(/\s+/g, ""))){
                    result.push(searchData[i])
                }
            }

            if(result.length > 0){
                setGoals(result)
            }else{
                setGoals([]);
                setNotFound(true);
            }

            console.log(notFound);
        }
        
    }

    return (
        <>
            <div className='flex items-center justify-center gap-2'>
                <div className='flex justify-center max-sm:w-[75%] sm:w-[50%]'>                
                    <input 
                        type="text" 
                        id='searchBar' 
                        name='searchBar'
                        className="flex-1 bg-gray-50 border leading-none border-gray-300 text-gray-900 text-[1em] rounded-s-full focus:ring-blue-500 focus:border-blue-500 block w-[50%] max-sm:py-1 max-sm:px-3 sm:py-2.5 sm:px-5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        onChange={
                            (e) => {
                                if(e.target.value === ""){
                                    handleSearch(e.target.value)
                                }
                            }
                        }
                        onKeyDown={
                            (e)=>{
                            if(e.key === "Enter"){
                                e.preventDefault();
                                const inputVal = (e.target as HTMLInputElement).value;
                                handleSearch(inputVal);
                                console.log(goals);
                            }
                        }}
                        placeholder='search'
                        autoComplete='off'
                    />
                    
                    <button onClick={()=>handleSearch(null)} id="searchBtn" className='bg-[rgb(16,16,16)] font-bold px-5 cursor-pointer rounded-e-full flex justify-center items-center'>
                        <Search className='text-white max-sm:w-[1em] sm:w-[24px]' size="100%"/>
                    </button>
                </div>
                <Link href='goal/newGoal' className='border border-white max-sm:p-1 sm:p-1.5 rounded-full cursor-pointer hover:bg-[rgb(31,31,31)] duration-200'>
                    <Plus className='text-white max-sm:w-[1em] w-[24px]' size="100%"/>
                </Link>
            </div>


            {goals.length > 0 ? (
                <div>
                    <ul className='bg-[rgb(16,16,16)] p-5 rounded grid max-sm:grid-cols-2 md:grid-cols-5 gap-3 text-[16px]'>
                        {goals.map((item, index)=> (
                            <li key={index} className='relative'>
                                <div className='absolute top-1.5 left-1.5'>
                                    <Circle className={`${item.status ? "text-green-500" : "text-yellow-500"} w-[12px]`} size="100%"/>
                                </div>
                                <Link href={`/goal/${item._id}`} className='max-sm:p-2 sm:p-5 md-p-5 lg-p-5 text-white h-full flex justify-center items-center font-bold max-sm:text-[1em] sm:text-[24px] border rounded hover:text-[rgb(16,16,16)] hover:bg-white duration-200 truncate w-full overflow-hidden whitespace-nowrap'>
                                    <div className='truncate overflow-hidden whitespace-nowrap'>
                                        {item.title}
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ): notFound && goals.length === 0 ? (
                <div className='bg-[rgb(16,16,16)] p-5 rounded text-[16px] flex flex-col gap-2 justify-center items-center'>
                    <p className='inline text-gray-500'>That goal don&apos;t exist yet...</p>
                </div>
            ):(
                <div className='bg-[rgb(16,16,16)] p-5 rounded text-[16px] flex flex-col gap-2 justify-center items-center'>
                    <Link href={`/goal/newGoal`} className='flex jusity-center items-center gap-2 bg-green-500 text-[rgb(22,22,22)] py-3 px-5 rounded font-bold -translate-y-0.25 hover:translate-none duration-200 cursor-pointer shadow-xl hover:shadow-none'>
                        <PlusCircle className='text-[rgb(16,16,16)] max-sm:w-[30px] sm:w-[3em]' size="100%"/>
                        <p className='max-sm:text-[24px] sm:text-3xl'>Add a Goal</p>
                    </Link>
                    <p className='inline text-gray-500'>No goal list yet...</p>
                </div>
            )}
        </>
    )
}

export default GoalItems