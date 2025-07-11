"use client"

import { Check, CircleAlert, Clock, Pencil, Plus, Trash2, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { toast, ToastContainer } from 'react-toastify'
import { Dialog } from '@headlessui/react'
import { formSchema } from '@/sanity/lib/validation'
import { createSchedule } from '@/lib/actions'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { to12Hour, toMinutes, toTimeString } from '@/lib/utils'
import { UpdateEdit } from '@/actions/updateSchedule'
import { z } from 'zod'


export type Entry = {
        _key: string;
        id: number;
        timeValue: string;
        timeValue2: string;
        activityVal?: string;
        status: string;
        activity: string;
        editingVal: boolean;
        editingVal2: boolean;
    };

export type wholeData = {
    title: string,
    allTime: Entry[],
}

const Addtime = ({schedule, id}: {schedule: {title: string, allTime: Entry[]} | null; id: string | null}) => {
    const [arr, setArr] = useState<Array<Entry>>(schedule?.allTime ?? []);

    const [title, setTitle] = useState<string | null>(schedule?.title ?? null);
    const [isOpen, setIsOpen] = useState(false);
    const [isTitle, setIsTitle] = useState(title ? true : false);
    const [selectedDelete, setSelectedDelete] = useState<{theId: number, theIndex:number} | null>(null);
    const [isPending, setIsPending] = useState<boolean>(false);
    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);


    const handleModal = (theIndex: number, theId: number) => {
        setSelectedDelete({theIndex, theId});
        setIsOpen(!isOpen);
    }

    const handleSubmit = async () => {        
        const copy: Entry[] = JSON.parse(JSON.stringify(arr));
        
        const allTime = copy.filter((item) => item.status != "Empty")

        console.log(allTime);

        if(!title){
            toast.error("Title is required...");
            return;
        }

        try {
            const theData: wholeData = {title, allTime};            

            await formSchema.parseAsync(theData);

            const result = await createSchedule(theData)

            if(result.error.trim() != ""){
                throw result.error;
            }

            setIsPending(true);

            router.push(`/schedule/${result._id}`);
            
            toast.success("Schedule Created");
        } catch(e) {
            if(e instanceof z.ZodError){
                const fieldError = e.flatten().fieldErrors;

                const theError = fieldError as unknown as Record<string, string>

                toast.error(`${theError.title}`);
            }else{
                toast.error((e as Error).message);
            }
        }
    }

    const handleEditVal = (theIndex: number, theID: number) => {
        const getSwitchState = arr.filter((item) => item.id === theID);

        const theSwitch = getSwitchState[0]?.editingVal;

        const switchVal = arr.map((item, index) => index == theIndex ? {...item, editingVal: !theSwitch} : item);

        setArr(switchVal);
    }

    const handleEditVal2 = (theIndex: number, theID: number) => {
        const getSwitchState = arr.filter((item) => item.id === theID);

        const theSwitch = getSwitchState[0]?.editingVal2;

        const switchVal = arr.map((item, index) => index == theIndex ? {...item, editingVal2: !theSwitch} : item);

        setArr(switchVal);
    }

    const handleAdd = (theIndex: number, theId: number) => {
        if(theIndex != arr.length - 1){
            const actVal = (document.getElementById(`activity${theIndex}`) as HTMLInputElement)?.value     
            const timeVal2 = (document.getElementById(`nextInput${theIndex}`) as HTMLInputElement)?.value

            if(!actVal){
                toast.error("Oops! You didn't put the activity yet...")
                return;
            }else if(!timeVal2){
                toast.error("Oops! You didn't input time...")
                return;
            }

            // Get all the current time:
            const currentTimes = arr.map((item: {timeValue: string}) => item.timeValue);
            const updated = updateTimes(currentTimes, theIndex, arr[theIndex]?.timeValue);
            const updateArr = arr.map((item,index) => item.id == theId ? {...item, timeValue: updated[index], editingVal: false, activity: actVal, status: 'Done', timeValue2: updated[index + 1]} : index != arr.length - 1 ? ({...item, timeValue: updated[index], timeValue2: updated[index + 1], editingVal: false}) : ({...item, timeValue: updated[index], editingVal: false}));

            const durationTimes = updateArr.map((item: {timeValue2: string}) => item.timeValue2);
            const updatedDuration = updateTimes(durationTimes, theIndex, timeVal2);

            const updateArr2 = updateArr.map((item, index) => index < theIndex ? {...item, timeValue: updated[index], timeValue2: updatedDuration[index], editingVal2: false} : item.id == theId ? {...item, status: 'Done', timeValue2: updatedDuration[index], editingVal2: false, activity: actVal} : index != arr.length - 1 ? {...item, timeValue: updatedDuration[index - 1], timeValue2: updatedDuration[index], editingVal2: false} : {...item, timeValue: updatedDuration[index - 1], timeValue2: updatedDuration[index], editingVal2: false})

            setArr(updateArr2)
        }else{
            const timeVal = (document.getElementById(`input${theIndex}`) as HTMLInputElement)?.value 
            const timeVal2 = (document.getElementById(`nextInput${theIndex}`) as HTMLInputElement)?.value
            const actVal = (document.getElementById(`activity${theIndex}`) as HTMLInputElement)?.value        
    
            if(!actVal){
                toast.error("Oops! You didn't put the activity yet...")
                return;
            }else if(!timeVal2 || !timeVal2){
                toast.error("Oops! You didn't input time...")
                return;
            }

            setTimeout(()=>{
                inputRef.current?.focus();
            }, 100)
    
            const [hour,min] = timeVal2.split(":");
    
            const nextMin =
                min === "59"
                    ? "00"
                    : String(Number(min) + 1).padStart(2, "0");
            
            const nextHour = 
                min === "59"
                    ? String((Number(hour) + 1) % 24).padStart(2, "0") // wrap around to 00 if hour == 23
                    : hour;
    
            if(arr.length >= 1){
                if(arr.length > 1){                
                    const fromMin = toMinutes(arr[theIndex]?.timeValue);
                    const toMin = toMinutes(timeVal2);
    
                    const addedDuration = (toMin - fromMin + 1440) % 1440;
    
                    const updateArr = arr.map((item) => item.id == theId ? {...item, activity: actVal, status: 'Done', timeValue2: timeVal2} : item)
    
                    if(theIndex != arr.length - 1){
                        console.log("testing testing...")
                    }
    
                    if (addedDuration === 0) {
                        toast.error("End time must be after start time.");
                        return;
                    }
    
                    updateArr.push({_key: nanoid() ,id: Date.now(), status: "Empty", activity: "", timeValue: `${updateArr[updateArr.length -1].timeValue2}`, timeValue2: `${nextHour}:${nextMin}`, editingVal: false, editingVal2: false});
    
                    setArr(updateArr);
    
                    return;
                }else{
                    if(theIndex != arr.length - 1){
                        console.log("Plus from the first index...")
                    }
    
                    if(toMinutes(timeVal2) < toMinutes(timeVal)){
                        toast.error("Time must be later than the previous one...");
                        return;
                    }
    
                    const updateArr = arr.map((item) => item.id == theId ? {...item, activity: actVal, timeValue: timeVal, status: 'Done', timeValue2: timeVal2} : item)
        
                    updateArr.push({_key: nanoid() ,id: Date.now(), status: "Empty", activity: "", timeValue: `${updateArr[updateArr.length -1].timeValue2}`, timeValue2: `${nextHour}:${nextMin}`, editingVal: false, editingVal2: false});
        
                    setArr(updateArr);
                }
            }else{
                if(toMinutes(timeVal2) < toMinutes(timeVal)){
                    toast.error("Time must be later than the previous one... abcd");
                    return;
                }
    
                const updateArr = arr.map(item => item.id == theId ? {...item, timeValue: timeVal, activity: actVal, status: 'Done', timeValue2: timeVal2} : item)
    
                updateArr.push({_key: nanoid() ,id: Date.now(), status: "Empty", activity: "", timeValue: `${updateArr[updateArr.length -1].timeValue2}`, timeValue2: `${nextHour}:${nextMin}`, editingVal: false, editingVal2: false});
    
                setArr(updateArr);
            }
        }
    }

    const handleInsert = (theIndex: number) => {
        const copy = JSON.parse(JSON.stringify(arr));

        const timeVal2 = copy[theIndex].timeValue2
        
        const [hour,min] = timeVal2.split(":");

        const nextMin =
            min === "59"
                ? "00"
                : String(Number(min) + 1).padStart(2, "0");
        
        const nextHour = 
            min === "59"
                ? String((Number(hour) + 1) % 24).padStart(2, "0") // wrap around to 00 if hour == 23
                : hour;

        copy.splice(theIndex + 1, 0, {_key: nanoid() ,id: Date.now(), status: "Empty", activity: "", timeValue: timeVal2, timeValue2: `${nextHour}:${nextMin}`, editingVal: false, editingVal2: false})

        setArr(copy);
    
    }

    const handleStart = () => {
        if(arr.length < 1){
            setArr([...arr, {_key: nanoid(), id: Date.now(), status: "Empty", activity: "", timeValue: "00:00", timeValue2: "00:00", editingVal: false, editingVal2: false}]);
        }else{
            const timeVal2 = arr[arr.length - 1].timeValue2

            const [hour,min] = timeVal2.split(":");

            const [hour2, min2] = timeVal2.split(":");

            const nextMin =
                min === "59"
                    ? "00"
                    : String(Number(min2) + 1).padStart(2, "0");
            
            const nextHour = 
                min === "59"
                    ? String((Number(hour2) + 1) % 24).padStart(2, "0") // wrap around to 00 if hour == 23
                    : hour;

            setArr([...arr, {_key: nanoid(), id: Date.now(), status: "Empty", activity: "", timeValue: `${timeVal2}`, timeValue2: `${nextHour}:${nextMin}`, editingVal: false, editingVal2: false}]);
        }
    }

    const handleEdit = (theIndex: number, theId: number) => {
        const updateArr = arr.map(item => item.id === theId ? { ...item, status: "Editing"} : item)

        setArr(updateArr);
    }

    function updateTimes(times: string[], changedIndex: number, newTime: string): string[]{
        const oldTime = times[changedIndex];
        const diff = toMinutes(newTime) - toMinutes(oldTime);

        // Create new array with updated times
        return times.map((time, index) => {
            if (index < changedIndex) return time; // No change

            if(time.slice(0,2) == "00"){
                const updated = 1440 + (toMinutes(time) + diff);

                return toTimeString(updated);
            }
            
            const updated = toMinutes(time) + diff;
            return toTimeString(updated);
        });
    }

    const handleUpdate = (theIndex: number, theId: number) => {
        const actVal = (document.getElementById(`activity${theIndex}`) as HTMLInputElement )?.value

        if(!actVal){
            toast.error("Oops! You didn't put the activity yet...")
            return;
        }

        if(arr.length - 1 != theIndex){
            if(arr[theIndex]?.editingVal){
                const timeVal = (document.getElementById(`input${theIndex}`) as HTMLInputElement)?.value

                if(!timeVal){
                    toast.error("Oops! You didn't input time...")
                    return;
                }

                if(arr.length > 1){
                    if(theIndex != 0){
                        const prevTime = arr[theIndex - 1]?.timeValue;
        
                        if(toMinutes(timeVal) < toMinutes(prevTime)){
                            toast.error("Time must be later than the previous one...");
                            return;
                        }
                    }
                }

                // Get all the current time:
                const currentTimes = arr.map((item: {timeValue: string}) => item.timeValue);

                const updated = updateTimes(currentTimes, theIndex, timeVal);
                
                if(theIndex == 0){
                    const updateArr = arr.map((item,index) => item.id == theId ? {...item, timeValue: updated[index], editingVal: false, activity: actVal, status: 'Done', timeValue2: updated[index + 1]} : index != arr.length - 1 ? ({...item, timeValue: updated[index], timeValue2: updated[index + 1], editingVal: false}) : ({...item, timeValue: updated[index], editingVal: false}));
    
                    setArr(updateArr);
                }else{
                    const updateArr = arr.map((item,index) => item.id == theId ? {...item, timeValue: updated[index], editingVal: false, activity: actVal, status: 'Done', timeValue2: updated[index + 1]} : index != arr.length - 1 ? ({...item, timeValue: updated[index], timeValue2: updated[index + 1], editingVal: false}) : ({...item, timeValue: updated[index], editingVal: false}));
    
                    setArr(updateArr);
                }            
            }else if(arr[theIndex]?.editingVal2){
                const timeVal2 = (document.getElementById(`nextInput${theIndex}`) as HTMLInputElement)?.value

                if(!timeVal2){
                    toast.error("Oops! You didn't input time...")
                    return;
                }

                // Get all the current time:
                const currentTimes = arr.map((item: {timeValue: string}) => item.timeValue);
                const updated = updateTimes(currentTimes, theIndex, arr[theIndex]?.timeValue);
                const updateArr = arr.map((item,index) => item.id == theId ? {...item, timeValue: updated[index], editingVal: false, activity: actVal, status: 'Done', timeValue2: updated[index + 1]} : index != arr.length - 1 ? ({...item, timeValue: updated[index], timeValue2: updated[index + 1], editingVal: false}) : ({...item, timeValue: updated[index], editingVal: false}));

                const durationTimes = updateArr.map((item: {timeValue2: string}) => item.timeValue2);
                const updatedDuration = updateTimes(durationTimes, theIndex, timeVal2);

                const updateArr2 = updateArr.map((item, index) => index < theIndex ? {...item, timeValue: updated[index], timeValue2: updatedDuration[index], editingVal2: false} : item.id == theId ? {...item, status: 'Done', timeValue2: updatedDuration[index], editingVal2: false, activity: actVal} : index != arr.length - 1 ? {...item, timeValue: updatedDuration[index - 1], timeValue2: updatedDuration[index], editingVal2: false} : {...item, timeValue: updatedDuration[index - 1], timeValue2: updatedDuration[index], editingVal2: false})

                setArr(updateArr2);
            }else{
                const updateArr3 = arr.map(item => item.id == theId ? {...item, activity: actVal, status: 'Done'} : item);
            
                setArr(updateArr3);
            }
        }else{
            if(arr[theIndex]?.editingVal){
                const timeVal = (document.getElementById(`input${theIndex}`) as HTMLInputElement)?.value

                if(!timeVal){
                    toast.error("Oops! You didn't input time...")
                    return;
                }

                // Get all the current time:
                const currentTimes = arr.map((item: {timeValue: string}) => item.timeValue);

                const lastTime = arr[theIndex].timeValue2;

                const fromMin = toMinutes(arr[theIndex]?.timeValue);
                const toMin = toMinutes(timeVal);
                
                const addedDuration = (toMin - fromMin);
    
                const newTimeVal2 = toTimeString(toMinutes(lastTime) + addedDuration);
            
                const updated = updateTimes(currentTimes, theIndex, timeVal);
                
                const updateArr = arr.map((item,index) => item.id == theId ? {...item, timeValue: updated[index], editingVal: false, activity: actVal, status: 'Done', timeValue2: newTimeVal2} : index != arr.length - 2 ? ({...item, timeValue: updated[index], timeValue2: updated[index + 1], editingVal: false}) : index == arr.length - 2 ? ({...item, timeValue: updated[index], timeValue2: updated[index + 1], editingVal: false}) : ({...item, timeValue: updated[index], editingVal: false}));

                setArr(updateArr);

            }else if(arr[theIndex]?.editingVal2){
                const timeVal2 = (document.getElementById(`nextInput${theIndex}`) as HTMLInputElement)?.value

                if(!timeVal2){
                    toast.error("Oops! You didn't input time...")
                    return;
                }

                const updatedArr = arr.map(item => item.id == theId ? {...item, timeValue2: timeVal2, status: "Done", editingVal2: false} : item);

                setArr(updatedArr);
            }else{
                const updateArr3 = arr.map(item => item.id == theId ? {...item, activity: actVal, status: 'Done'} : item);
            
                setArr(updateArr3);
            }
        }
    }

    const handleCancel = (theIndex: number, theId: number) => {
        const updateArr = arr.map(item => item.id === theId ? { ...item, status: "Done", editingVal: false, editingVal2: false} : item)

        setArr(updateArr);
    }

    const handleDelete = (theIndex: number, theId: number) => {
        const itemToDelete = arr.find(item => item.id === theId);
        if (!itemToDelete) return;
        
        const updatedArr = arr.filter(item => item.id !== theId);
        setArr(updatedArr);
        
        // Optional: Fix next entry’s timeValue if needed (relinking continuity)
        if (theIndex > 0 && theIndex < arr.length - 1) {
            const prevItem = arr[theIndex - 1];
            const nextItem = arr[theIndex + 1];

            // You may want to "relink" the previous timeValue2 with the next timeValue
            const newTimeValue = prevItem.timeValue2;

            const fixedArr = updatedArr.map(item =>
                item.id === nextItem.id ? { ...item, timeValue: newTimeValue } : item
            );
            setArr(fixedArr);
        }

        setIsOpen(false);
    };

    const handleAddTitle = () => {
        const title = (document.getElementById("theTitle") as HTMLInputElement)?.value

        if(!title){
            toast.error("Title is required...")
        }else{
            setTitle(title);
            setIsTitle(true);
        }
    }

    const handleUpdateEdit = async () => {
        if(!title){
            toast.error("Title is required...");
            return;
        }

        const copy: Entry[] = JSON.parse(JSON.stringify(arr));

        const filteredTime: Entry[] = copy.filter((_, index) => index !== arr.length - 1)
        
        const allTime = copy[copy.length - 1].status === "Empty" ? filteredTime : copy
        
        try {
            const response = await UpdateEdit(id!, title, allTime)

            console.log('Updated:', response);
        
            toast.success("Updated Successfully...")

            router.push(`/schedule/${id}`)
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

  return (
    <section aria-label='Schedule Edit Section' className='p-5 flex flex-col gap-3' id="theForm">
        {isTitle ? (
            <div className='shadow-xl rounded max-sm:p-2 sm:p-5 mb-3 flex gap-2 max-sm:justify-center sm:justify-between items-center'>
                <h1 className='text-white font-bold max-sm:text-[19px] sm:text-3xl inline-block whitespace-normal break-all'>Title: {title}</h1>
                <button onClick={()=> setIsTitle(!isTitle)} type='button' className='bg-blue-500 p-2 sm:rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                    <Pencil className='text-[rgb(22,22,22)]'/>
                </button>
            </div>
        ) : (
            <form className='flex gap-2 items-center mb-5 max-sm:text-[16px]'>
                <h1 className='text-white font-bold max-sm:text-[1em] sm:text-3xl flex items-center'>Title: </h1>
                <input 
                    id="theTitle" 
                    type="text" 
                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 max-sm:text-[1em] sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    autoComplete='off' 
                    placeholder={title ? title : "What title should this schedule have?"} 
                    onKeyDown={(e)=>{
                        if(e.key === "Enter"){
                            e.preventDefault();
                            handleAddTitle();
                        }
                    }}
                    required
                />
            
                <button onClick={()=>handleAddTitle()} type='button' className='bg-green-400 p-2 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                    <Check className='text-[rgb(22,22,22)]'/>
                </button>
                
                {title ? (
                    <button
                        onClick={() => setIsTitle(!isTitle)}
                        type='button' 
                        className='
                            bg-red-500 
                            p-2 
                            max-sm:rounded-sm
                            sm:rounded-xl 
                            cursor-pointer 
                            -translate-y-0.5 
                            hover:translate-none 
                            duration-500 
                            cursor-pointer
                            h-full
                        '>
                        <X className='text-[rgb(22,22,22)]'/>
                    </button>
                ): (
                    null
                )}
                
            </form>
            
        )}
        
        <ul className='flex flex-col gap-2'>
            { arr.length === 0 ? 
                (
                    <button onClick={()=>handleStart()} type='button' className='bg-green-400 p-2 rounded-xl w-full flex justify-center -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                        <Plus className='text-[rgb(22,22,22)]'/>
                    </button>
                ) : arr.length === 1 ?
                arr.map((item, index) => (
                    <div key={item?.id} className='flex sm:items-center max-sm:gap-1 sm:gap-1 md:gap-3 border border-white p-1 md:p-5 rounded justify-between'>
                        { item.status === "Empty" || item.status === "Editing" ? (
                                <div className='flex max-sm:flex-col sm:flex-row gap-2 flex-1 max-sm:text-[12px]'>
                                    <div className='flex justify-center items-center gap-2 max-sm:text-[12px] whitespace-nowrap'>
                                        <div className='relative'>
                                            <input 
                                                type="time" 
                                                id={`input${index}`} 
                                                className="
                                                    bg-gray-50 
                                                    border 
                                                    leading-none 
                                                    border-gray-300 
                                                    text-gray-900 
                                                    max-sm:text-[1em]
                                                    sm:text-sm
                                                    max-sm:rounded-sm
                                                    sm:rounded-lg 
                                                    focus:ring-blue-500 
                                                    focus:border-blue-500
                                                    max-sm:w-[95px]
                                                    sm:w-full 
                                                    max-sm:p-1
                                                    md:p-2.5 
                                                    dark:bg-gray-700 
                                                    dark:border-gray-600 
                                                    dark:placeholder-gray-400 
                                                    dark:text-white 
                                                    dark:focus:ring-blue-500 
                                                    dark:focus:border-blue-500"
                                                min={index > 0 ? arr[index - 1].timeValue : "00:00"} 
                                                defaultValue={item.timeValue} 
                                                onKeyDown={(e)=>{
                                                    if(e.key === "Enter"){
                                                        e.preventDefault();
                                                        handleAdd(index, item?.id)
                                                    }
                                                }}
                                                required 
                                            />
                                            <div className="
                                                absolute 
                                                inset-y-0 
                                                end-0 
                                                top-0 
                                                flex 
                                                items-center 
                                                max-sm:pe-2
                                                sm:pe-3 
                                                pointer-events-none"
                                            >
                                                <Clock className='text-white max-sm:w-[15px] w-[20px]' size="100%"/>
                                            </div>
                                        </div>

                                        <h1 className='text-white font-bold max-sm:text-[1em]'>to</h1>

                                        <div className='relative'>
                                            <input 
                                                type="time" 
                                                id={`nextInput${index}`} 
                                                className="
                                                    bg-gray-50 
                                                    border 
                                                    leading-none 
                                                    border-gray-300 
                                                    text-gray-900 
                                                    max-sm:text-[1em]
                                                    sm:text-sm
                                                    max-sm:rounded-sm
                                                    sm:rounded-lg 
                                                    focus:ring-blue-500 
                                                    focus:border-blue-500
                                                    max-sm:w-[95px]
                                                    sm:w-full 
                                                    max-sm:p-1
                                                    md:p-2.5 
                                                    dark:bg-gray-700 
                                                    dark:border-gray-600 
                                                    dark:placeholder-gray-400 
                                                    dark:text-white 
                                                    dark:focus:ring-blue-500 
                                                    dark:focus:border-blue-500"
                                                min={index > 0 ? arr[index - 1].timeValue : "00:00"} 
                                                defaultValue={item.timeValue} 
                                                onKeyDown={(e)=>{
                                                    if(e.key === "Enter"){
                                                        e.preventDefault();
                                                        handleAdd(index, item?.id)
                                                    }
                                                }}
                                                required />
                                            <div className="
                                                absolute 
                                                inset-y-0 
                                                end-0 
                                                top-0 
                                                flex 
                                                items-center 
                                                max-sm:pe-2
                                                sm:pe-3 
                                                pointer-events-none"
                                            >
                                                <Clock className='text-white max-sm:w-[15px] w-[20px]' size="100%"/>
                                            </div>
                                        </div>
                                        
                                        <h1 className='text-white font-bold max-sm:text-[1em] max-sm:hidden sm:visible'>:</h1>
                                    </div>

                                    <input 
                                        id={`activity${index}`} 
                                        type="text" 
                                        className="
                                            bg-gray-50 
                                            border 
                                            leading-none 
                                            border-gray-300 
                                            text-gray-900
                                            max-sm:text-[1em]
                                            sm:text-sm
                                            max-sm:rounded-sm 
                                            sm:rounded-lg 
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
                                        defaultValue={item.activity} 
                                        autoComplete='off' 
                                        onKeyDown={(e)=>{
                                            if(e.key === "Enter"){
                                                e.preventDefault();
                                                handleAdd(index, item?.id);
                                            }
                                        }}
                                        required
                                        placeholder='What will you be doing during this time?'
                                    />
                                </div>
                            ) : 
                                <div className='flex max-sm:flex-col sm:flex-row items-center max-sm:gap-none sm:gap-3 flex-1 max-sm:text-[10px]'>
                                    <div className='max-sm:bg-white max-sm:p-1 max-sm:text-[rgb(22,22,22)] sm:text-white flex items-center max-sm:gap-1 sm:gap-3'>
                                        <h1 className='max-sm:bg-white font-bold max-sm:text-[1em] sm:text-3xl flex items-center whitespace-nowrap'>
                                            {to12Hour(item.timeValue)}

                                            <span className='max-sm:text-[1em] sm:text-lg font-normal mx-2'> to </span>

                                            {to12Hour(item.timeValue2)}
                                        
                                            <span className='max-sm:hidden ms-2'>:</span>
                                        </h1>                                    
                                        
                                    </div>

                                    <p className='text-white font-normal max-sm:text-[1em] sm:text-3xl inline-block whitespace-normal break-all'>{item.activity}</p>
                                </div>
                        }
                        
                        { item.status === "Empty" ? (
                                <div>
                                    <button 
                                        onClick={()=>handleAdd(index, item?.id)} 
                                        type='button' 
                                        className='
                                            bg-green-400 
                                            p-2 
                                            max-sm:rounded-sm
                                            sm:rounded-xl 
                                            -translate-y-0.5 
                                            hover:translate-none 
                                            duration-500 
                                            cursor-pointer
                                            h-full
                                        '>
                                        <Plus className='text-[rgb(22,22,22)]'/>
                                    </button>
                                </div>
                            ) : item.status === "Done" ? (
                                <div className='flex items-center max-sm:gap-1 sm:gap-2'>
                                    <button 
                                        onClick={()=>handleEdit(index, item?.id)} 
                                        type='button' 
                                        className='
                                            bg-blue-500 
                                            p-2 
                                            max-sm:rounded-sm
                                            sm:rounded-xl
                                            -translate-y-0.5 
                                            hover:translate-none 
                                            duration-500 
                                            cursor-pointer
                                        '>
                                        <Pencil className='text-[rgb(22,22,22)]'/>
                                    </button>
                                    <button 
                                        onClick={()=>handleModal(index, item?.id)} 
                                        type='button' 
                                        className='
                                            bg-red-500 
                                            p-2 
                                            max-sm:rounded-sm
                                            sm:rounded-xl 
                                            cursor-pointer 
                                            -translate-y-0.5 
                                            hover:translate-none 
                                            duration-500 
                                            cursor-pointer'>
                                        <Trash2 className='text-[rgb(22,22,22)]'/>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center sm:gap-2">
                                    <button 
                                        onClick={()=>handleUpdate(index, item?.id)}
                                        type='button' 
                                        className='
                                            bg-blue-500 
                                            p-2 
                                            max-sm:rounded-sm
                                            sm:rounded-xl
                                            -translate-y-0.5 
                                            hover:translate-none 
                                            duration-500 
                                            cursor-pointer
                                            h-full
                                        '>
                                        <Check className='text-[rgb(22,22,22)]'/>
                                    </button>
                                    <button 
                                        onClick={()=>handleUpdate(index, item?.id)} 
                                        type='button' 
                                        className='
                                            bg-red-500 
                                            p-2 
                                            max-sm:rounded-sm
                                            sm:rounded-xl 
                                            cursor-pointer 
                                            -translate-y-0.5 
                                            hover:translate-none 
                                            duration-500 
                                            cursor-pointer
                                            h-full
                                        '>
                                        <X className='text-[rgb(22,22,22)]'/>
                                    </button>
                                </div>
                            )
                        }
                    </div>
                )) : (
                    arr.map((item, index) => 
                        <li key={item?.id} className='flex items-center max-sm:gap-1 sm:gap-3 border border-white max-sm:p-1 sm:p-5 rounded justify-between max-sm:text-[12px]'>
                            { item.status === "Empty" ? (
                                    <form className='flex max-sm:flex-col sm:flex-row flex-1 max-sm:gap-1 sm:gap-2'>
                                        <div className='flex justify-center max-sm:p-1 items-center sm:gap-2'>
                                            <h1 className='text-white font-bold max-sm:text-[1em] sm:text-4xl flex max-sm:gap-1 sm:gap-2 items-center whitespace-nowrap'>
                                                {to12Hour(item.timeValue)}
                                                
                                                <span className='max-sm:text-[1em] sm:text-lg font-normal max-sm:me-1'>to</span>
                                            </h1>

                                            <div className='relative'>
                                                <input 
                                                    type="time" 
                                                    id={`nextInput${index}`} 
                                                    className="
                                                        bg-gray-50 
                                                        border 
                                                        leading-none 
                                                        border-gray-300 
                                                        text-gray-900 
                                                        max-sm:text-[1em]
                                                        sm:text-sm
                                                        max-sm:rounded-sm
                                                        sm:rounded-lg 
                                                        focus:ring-blue-500 
                                                        focus:border-blue-500
                                                        max-sm:w-[95px]
                                                        md:w-full 
                                                        max-sm:p-1
                                                        md:p-2.5 
                                                        dark:bg-gray-700 
                                                        dark:border-gray-600 
                                                        dark:placeholder-gray-400 
                                                        dark:text-white 
                                                        dark:focus:ring-blue-500 
                                                        dark:focus:border-blue-500" 
                                                        min={index > 0 ? arr[index - 1].timeValue : "00:00"} 
                                                        defaultValue={item.timeValue2} 
                                                        required 
                                                    />
                                                <div className="
                                                    absolute 
                                                    inset-y-0 
                                                    end-0 
                                                    top-0 
                                                    flex 
                                                    items-center 
                                                    max-sm:pe-2
                                                    sm:pe-3 
                                                    pointer-events-none"
                                                >
                                                    <Clock className='text-white max-sm:w-[15px] w-[20px]' size="100%"/>
                                                </div>
                                            </div>
                                        
                                            <h1 className='text-white font-bold max-sm:hidden sm:visible'>:</h1>
                                        </div>

                                        <input 
                                            autoFocus
                                            id={`activity${index}`} 
                                            type="text" 
                                            className="
                                                bg-gray-50 
                                                border 
                                                leading-none 
                                                border-gray-300 
                                                text-gray-900
                                                max-sm:text-[1em]
                                                sm:text-sm
                                                max-sm:rounded-sm 
                                                sm:rounded-lg 
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
                                            defaultValue={item.activity} 
                                            autoComplete='off' 
                                            onKeyDown={(e)=>{
                                                if(e.key === "Enter"){
                                                    e.preventDefault();
                                                    handleAdd(index, item?.id);
                                                }
                                            }}
                                            required
                                            placeholder='What will you be doing during this time?'  
                                        />

                                        <div className="flex items-center justify-center max-sm:gap-1 sm:gap-2">
                                            <button 
                                                onClick={()=>handleAdd(index, item?.id)} 
                                                type='button' 
                                                className='
                                                bg-green-500 
                                                p-2 
                                                max-sm:rounded-sm
                                                sm:rounded-xl
                                                -translate-y-0.5 
                                                hover:translate-none 
                                                duration-500 
                                                cursor-pointer
                                                h-full
                                            '>
                                                <Plus className='text-[rgb(22,22,22)]'/>
                                            </button>
                                            <button 
                                                onClick={()=>handleDelete(index, item?.id)} 
                                                type='button' 
                                                className='
                                                bg-red-500 
                                                p-2 
                                                max-sm:rounded-sm
                                                sm:rounded-xl 
                                                cursor-pointer 
                                                -translate-y-0.5 
                                                hover:translate-none 
                                                duration-500 
                                                cursor-pointer
                                                h-full
                                            '>
                                                <X className='text-[rgb(22,22,22)]'/>
                                            </button>
                                        </div>
                                    </form>
                                ) : item.status === "Editing" ? (
                                    <form className='flex max-sm:flex-col flex-1 max-sm:gap-1 items-center max-sm:text-[12px] gap-2'>  
                                        {item.editingVal ? (
                                            <div className='flex'>
                                                <div className='relative'>
                                                    <input 
                                                    type="time" 
                                                    id={`input${index}`} 
                                                    className="
                                                            bg-gray-50 
                                                            border 
                                                            leading-none 
                                                            border-gray-300 
                                                            text-gray-900 
                                                            max-sm:text-[1em]
                                                            sm:text-sm
                                                            max-sm:rounded-sm
                                                            sm:rounded-lg 
                                                            focus:ring-blue-500 
                                                            focus:border-blue-500
                                                            max-sm:w-[95px]
                                                            md:w-full 
                                                            max-sm:p-1
                                                            md:p-2.5 
                                                            dark:bg-gray-700 
                                                            dark:border-gray-600 
                                                            dark:placeholder-gray-400 
                                                            dark:text-white 
                                                            dark:focus:ring-blue-500 
                                                            dark:focus:border-blue-500"
                                                    min={index > 0 ? arr[index - 1].timeValue : "00:00"} defaultValue={item.timeValue} required />
                                                    <div className="
                                                        absolute 
                                                        inset-y-0 
                                                        end-0 
                                                        top-0 
                                                        flex 
                                                        items-center 
                                                        max-sm:pe-2
                                                        sm:pe-3 
                                                        pointer-events-none"
                                                    >
                                                        <Clock className='text-white max-sm:w-[15px] w-[20px]' size="100%"/>
                                                    </div>
                                                </div>

                                                <h1 className='text-white font-bold max-sm:text-[1em] sm:text-4xl flex gap-1 items-center whitespace-nowrap'>
                                                    <span className='text-[1em] sm:text-lg font-normal max-sm:ms-1 sm:mx-2'> to </span>
                                                        
                                                    {to12Hour(item.timeValue2)}
                                                </h1>
                                            </div>
                                        ) : item.editingVal2 ? ( 
                                            <div className='flex'>
                                                <h1 className='text-white font-bold max-sm:text-[1em] sm:text-4xl flex gap-1 items-center whitespace-nowrap'>
                                                    {to12Hour(item.timeValue)}
                                                    
                                                    <span className='max-sm:text-[1em] sm:text-lg font-normal max-sm:me-1 sm:mx-2'> to </span>
                                                </h1>

                                                <div className='relative'>
                                                    <input 
                                                        type="time" 
                                                        id={`nextInput${index}`} 
                                                        className="
                                                            bg-gray-50 
                                                            border 
                                                            leading-none 
                                                            border-gray-300 
                                                            text-gray-900 
                                                            max-sm:text-[1em]
                                                            sm:text-sm
                                                            max-sm:rounded-sm
                                                            sm:rounded-lg 
                                                            focus:ring-blue-500 
                                                            focus:border-blue-500
                                                            max-sm:w-[95px]
                                                            md:w-full 
                                                            max-sm:p-1
                                                            md:p-2.5 
                                                            dark:bg-gray-700 
                                                            dark:border-gray-600 
                                                            dark:placeholder-gray-400 
                                                            dark:text-white 
                                                            dark:focus:ring-blue-500 
                                                            dark:focus:border-blue-500" 
                                                            min={index > 0 ? arr[index - 1].timeValue : "00:00"} 
                                                            defaultValue={item.timeValue2} 
                                                            required 
                                                        />
                                                    <div className="
                                                        absolute 
                                                        inset-y-0 
                                                        end-0 
                                                        top-0 
                                                        flex 
                                                        items-center 
                                                        max-sm:pe-2
                                                        sm:pe-3 
                                                        pointer-events-none"
                                                    >
                                                        <Clock className='text-white max-sm:w-[15px] w-[20px]' size="100%"/>
                                                    </div>
                                                </div>
                                            
                                            </div>
                                        ) : (
                                            <div className='flex'>
                                                <h1 className='text-white font-bold flex gap-1 items-center whitespace-nowrap max-sm:text-[1em] sm:text-3xl'>
                                                    <button onClick={()=>handleEditVal(index, item?.id)} type='button' className='bg-blue-500 max-sm:p-1 sm:p-3 max-sm:rounded-sm sm:rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer text-[rgb(22,22,22)]'>
                                                        {to12Hour(item.timeValue)}
                                                    </button>

                                                    <span className='max-sm:text-[1em] sm:text-lg font-normal max-sm:mx-1 sm:mx-2'> to </span>
                                                    
                                                    <button onClick={()=>handleEditVal2(index, item?.id)} type='button' className='bg-blue-500 max-sm:p-1 sm:p-3 max-sm:rounded-sm sm:rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer text-[rgb(22,22,22)]'>
                                                        {to12Hour(item.timeValue2)}
                                                    </button>
                                                </h1>
                                            </div>
                                        )}

                                        <h1 className='text-white font-bold max-sm:hidden sm:visible text-[1em]'>:</h1>

                                        <input 
                                            id={`activity${index}`} 
                                            type="text" 
                                            className="
                                                bg-gray-50 
                                                border 
                                                leading-none 
                                                border-gray-300 
                                                text-gray-900
                                                max-sm:text-[1em]
                                                sm:text-sm
                                                max-sm:rounded-sm 
                                                sm:rounded-lg 
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
                                            defaultValue={item.activity} 
                                            autoComplete='off' 
                                            onKeyDown={(e)=>{
                                                if(e.key === "Enter"){
                                                    e.preventDefault();
                                                    handleUpdate(index, item?.id);
                                                }
                                            }}
                                            required
                                            placeholder='What will you be doing during this time?'
                                        />

                                        <div className='flex items-center max-sm:gap-1 sm:gap-2'>
                                            <button onClick={()=>handleUpdate(index, item?.id)} type='button' className='bg-green-400 p-2 max-sm:rounded-sm sm:rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer h-full'>
                                                <Check className='text-[rgb(22,22,22)]'/>
                                            </button>
                                            <button onClick={()=>handleCancel(index, item?.id)} type='button' className='bg-red-500 p-2 max-sm:rounded-sm sm:rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer h-full'>
                                                <X className='text-[rgb(22,22,22)]'/>
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className='flex max-sm:flex-col sm:flex-row items-center max-sm:gap-1 sm:gap-3 flex-1 max-sm:text-[1em]'>
                                        <div className='max-sm:bg-white max-sm:p-1 max-sm:text-[rgb(22,22,22)] sm:text-white flex items-center max-sm:gap-1 sm:gap-3'>
                                            <h1 className='max-sm:bg-white font-bold max-sm:text-[1em] sm:text-3xl flex items-center whitespace-nowrap'>
                                                {to12Hour(item.timeValue)}

                                                <span className='max-sm:text-[1em] sm:text-lg font-normal mx-2'> to </span>

                                                {to12Hour(item.timeValue2)}
                                            
                                                <span className='max-sm:hidden ms-2'>:</span>
                                            </h1>                                    
                                            
                                        </div>

                                        <p className='text-white font-normal max-sm:text-[1em] sm:text-3xl inline-block whitespace-normal break-all flex-1'>{item.activity}</p>

                                        <div className='flex items-center max-sm:gap-1 sm:gap-2'>
                                            <button 
                                                onClick={()=>handleEdit(index, item?.id)} 
                                                type='button' 
                                                className='
                                                    bg-blue-500 
                                                    p-2 
                                                    max-sm:rounded-sm
                                                    sm:rounded-xl 
                                                    -translate-y-0.5 
                                                    hover:translate-none 
                                                    duration-500 
                                                    cursor-pointer
                                                    h-full
                                                '>
                                                <Pencil className='text-[rgb(22,22,22)]'/>
                                            </button>
                                            {arr[index + 1]?.status != "Empty" &&
                                                <button 
                                                    onClick={()=>handleInsert(index)} 
                                                    type='button' 
                                                    className='
                                                    bg-green-500 
                                                    p-2 
                                                    max-sm:rounded-sm
                                                    sm:rounded-xl
                                                    -translate-y-0.5 
                                                    hover:translate-none 
                                                    duration-500 
                                                    cursor-pointer
                                                    h-full
                                                '>
                                                    <Plus className='text-[rgb(22,22,22)]'/>
                                                </button>
                                            }
                                            <button 
                                                onClick={()=>handleModal(index, item?.id)} 
                                                type='button' 
                                                className='
                                                    bg-red-500 
                                                    p-2 
                                                    max-sm:rounded-sm
                                                    sm:rounded-xl  
                                                    cursor-pointer 
                                                    -translate-y-0.5 
                                                    hover:translate-none 
                                                    duration-500 
                                                    cursor-pointer
                                                    h-full
                                                '>
                                                <Trash2 className='text-[rgb(22,22,22)]'/>
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                        </li>
                    ) 
                )
            }
        </ul>

        {arr.length >= 1 ? ( 
            <>
                {schedule ? (
                    <>
                        { arr[arr.length - 1].status != "Empty" &&
                            <button onClick={()=>handleStart()} type='button' className='bg-green-400 p-2 rounded-xl w-full flex justify-center -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                                <Plus className='text-[rgb(22,22,22)]'/>
                            </button>
                        }
                        <button
                            onClick={()=>handleUpdateEdit()} 
                            className={`text-[rgb(22,22,22)] mt-2 rounded p-5 font-bold ${isPending ? 'bg-green-300' : '-translate-y-2 hover:translate-none duration-500 bg-blue-400 hover:cursor-pointer'} `}
                            disabled={isPending}
                        >
                            Update
                        </button>
                    </>

                ) : (
                    <>
                        { arr[arr.length - 1].status != "Empty" &&
                            <button onClick={()=>handleStart()} type='button' className='bg-green-400 p-2 max-sm:rounded-sm sm:rounded-xl w-full flex justify-center -translate-y-0.5 hover:translate-none duration-500 cursor-pointer max-sm:text-[10px]'>
                                <Plus className='text-[rgb(22,22,22)] max-sm:w-[20px] sm:w-[2em]' size="100%"/>
                            </button>
                        }
                        <button 
                            onClick={()=>handleSubmit()} 
                            className={`text-[rgb(22,22,22)] mt-2 rounded max-sm:p-2 sm:p-5 font-bold ${isPending ? 'bg-green-300' : '-translate-y-2 hover:translate-none duration-500 bg-green-400 hover:cursor-pointer'} `}
                            disabled={isPending}
                        >
                            {isPending ? 'Submitting...' : 'Submit'}
                        </button>
                    </>
                )}
            </>
        ) : (
            null
        )}
        <ToastContainer theme='dark'/>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
            <div className='fixed inset-0 bg-black/30'></div>

            <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
                <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-5 w-[50%]">
                    <div className='flex justify-center flex-col items-center gap-3'>
                        <CircleAlert size={100} className='text-red-500'/>
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
        </Dialog>
    </section>
    )
}

export default Addtime
