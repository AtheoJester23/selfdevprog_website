"use client"

import { Check, CircleAlert, Clock, ConstructionIcon, Pencil, Plus, Trash2, X } from 'lucide-react'
import React, { useActionState, useRef, useState } from 'react'
import { format, parse } from 'date-fns'
import 'react-toastify/dist/ReactToastify.css'
import { toast, ToastContainer } from 'react-toastify'
import { Dialog } from '@headlessui/react'
import { validation } from 'sanity'
import { formSchema } from '@/sanity/lib/validation'
import { createSchedule } from '@/lib/actions'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { to12Hour, toMinutes, getTimeDifferenceInDayCycle } from '@/lib/utils'
import { client } from '@/sanity/lib/client'
import { UpdateEdit } from '@/actions/updateSchedule'

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

const Addtime = ({schedule, id}: {schedule: {title: string, allTime: Entry[]} | null; id: string}) => {
    const [arr, setArr] = useState<Array<Entry>>(schedule?.allTime ?? []);

    console.log("arr: ", schedule?.title);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [title, setTitle] = useState<any>(schedule?.title ?? null);
    const [isOpen, setIsOpen] = useState(false)
    const [selectedDelete, setSelectedDelete] = useState<{theId: number, theIndex:number} | null>(null);
    const [isPending, setIsPending] = useState<boolean>(false);
    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);


    const handleModal = (theIndex: number, theId: number) => {
        console.log('modal closed...');
        setSelectedDelete({theIndex, theId});
        setIsOpen(!isOpen);

        console.log(selectedDelete);
    }

    const handleSubmit = async (isPending: boolean) => {        
        const copy: Entry[] = JSON.parse(JSON.stringify(arr));

        const filteredTime: Entry[] = copy.filter((_, index) => index !== arr.length - 1)
        
        const allTime = copy[copy.length - 1].status === "Empty" ? filteredTime : copy

        if(!title){
            toast.error("Title is required...");
            return;
        }

        console.log(totalMinutes);

        console.log(allTime);

        try {
            const theData: wholeData = {title, allTime};            

            await formSchema.parseAsync(theData);

            const result = await createSchedule(theData)
            
            console.log(result);

            console.log("Result: ",result.error)

            if(result.error.trim() != ""){
                throw result.error;
            }

            setIsPending(true);

            router.push(`/schedule/${result._id}`);
            
            toast.success("Schedule Created");
        } catch(e) {
            toast.error((e as Error).message);
        }
    }

    const handleEditVal = (theIndex: number, theID: number) => {
        const getSwitchState = arr.filter((item, index) => item.id === theID);

        const theSwitch = getSwitchState[0]?.editingVal;

        const switchVal = arr.map((item, index) => index == theIndex ? {...item, editingVal: !theSwitch} : item);

        setArr(switchVal);
    }

    const handleEditVal2 = (theIndex: number, theID: number) => {
        const getSwitchState = arr.filter((item, index) => item.id === theID);

        const theSwitch = getSwitchState[0]?.editingVal2;

        const switchVal = arr.map((item, index) => index == theIndex ? {...item, editingVal2: !theSwitch} : item);

        setArr(switchVal);
    }

    const handleAdd = (theIndex: number, theId: number) => {
        let timeVal = (document.getElementById(`input${theIndex}`) as HTMLInputElement)?.value 
        let timeVal2 = (document.getElementById(`nextInput${theIndex}`) as HTMLInputElement)?.value
        let actVal = (document.getElementById(`activity${theIndex}`) as HTMLInputElement)?.value        

        console.log(timeVal2);

        setTimeout(()=>{
            inputRef.current?.focus();
        }, 100)

        let [hour,min] = timeVal2.split(":");

        let newHour =
            hour === "11" && min === "59"
                ? "11"
                : hour === "23" && min === "59"
                ? "23"
                    : min === "59"
                        ? String((Number(hour)) % 24).padStart(2, "0")
                        : hour;

        let newMin = 
            hour === "11" && min === "59"
                ? "59"
                : hour === "23" && min === "59"
                ? "59"
                    : min === "59"
                        ? "00"
                        : String(Number(min)).padStart(2, "0");

        let [hour2, min2] = timeVal2.split(":");

        let nextMin =
            min === "59"
                ? "00"
                : String(Number(min2) + 1).padStart(2, "0");
        
        let nextHour = 
            min === "59"
                ? String((Number(hour2) + 1) % 24).padStart(2, "0") // wrap around to 00 if hour == 23
                : hour;

        if(arr.length >= 1){

            if(arr.length > 1){
                const prevTime = arr[theIndex - 1]?.timeValue;
                console.log("This is the prevTime: ", prevTime);
                
                console.log(toMinutes(timeVal2));
                
                const startTime = arr[0]?.timeValue; // first item in the schedule

                const fromMin = toMinutes(arr[theIndex]?.timeValue);
                const toMin = toMinutes(timeVal2);

                const addedDuration = (toMin - fromMin + 1440) % 1440;

                const timeDiff = toMinutes(timeVal2) - toMinutes(prevTime);
    
                const hourDiff = Math.floor(Math.floor(timeDiff / 60));
                const minsDiff = timeDiff % 60;
            
                console.log(`This is new time: ${newHour}:${newMin}`);

                const updateArr = arr.map((item,index) => item.id == theId ? {...item, activity: actVal, status: 'Done', timeValue2: timeVal2} : item)

                const totalMinutesSoFar = arr.reduce((sum, item) => {
                    return sum + getTimeDifferenceInDayCycle(item.timeValue, item.timeValue2);
                }, 0);

                const newTotal = totalMinutesSoFar + addedDuration;

                if (addedDuration === 0) {
                    toast.error("End time must be after start time.");
                    return;
                }

                console.log("")
                console.log("Added Duration: ", addedDuration);
                
                console.log("TotalMinutes: ", totalMinutes);
                console.log(`TotalMinutes + Added Duration = ${totalMinutes + addedDuration}`)
                console.log("")

                updateArr.push({_key: nanoid() ,id: Date.now(), status: "Empty", activity: "", timeValue: `${updateArr[updateArr.length -1].timeValue2}`, timeValue2: `${nextHour}:${nextMin}`, editingVal: false, editingVal2: false});

                setArr(updateArr);
                recalculateTotalMinutes(updateArr)

                console.log(updateArr);
                return;
            }else{
                if(toMinutes(timeVal2) < toMinutes(timeVal)){
                    toast.error("Time must be later than the previous one...");
                    return;
                }

                const updateArr = arr.map((item,index) => item.id == theId ? {...item, activity: actVal, timeValue: timeVal, status: 'Done', timeValue2: timeVal2} : item)
    
                updateArr.push({_key: nanoid() ,id: Date.now(), status: "Empty", activity: "", timeValue: `${updateArr[updateArr.length -1].timeValue2}`, timeValue2: `${nextHour}:${nextMin}`, editingVal: false, editingVal2: false});
    
                setArr(updateArr);
                recalculateTotalMinutes(updateArr)
            }
        }else{
            if(toMinutes(timeVal2) < toMinutes(timeVal)){
                toast.error("Time must be later than the previous one... abcd");
                return;
            }

            const updateArr = arr.map(item => item.id == theId ? {...item, timeValue: timeVal, activity: actVal, status: 'Done', timeValue2: timeVal2} : item)

            updateArr.push({_key: nanoid() ,id: Date.now(), status: "Empty", activity: "", timeValue: `${updateArr[updateArr.length -1].timeValue2}`, timeValue2: `${nextHour}:${nextMin}`, editingVal: false, editingVal2: false});

            setArr(updateArr);
            recalculateTotalMinutes(updateArr);

            console.log(updateArr);
            console.log("3. The length is: ", arr.length)
        }
    }

    const handleStart = () => {
        if(arr.length < 1){
            setArr([...arr, {_key: nanoid(), id: Date.now(), status: "Empty", activity: "", timeValue: "00:00", timeValue2: "00:00", editingVal: false, editingVal2: false}]);
        }else{
            const timeVal2 = arr[arr.length - 1].timeValue2

            let [hour,min] = timeVal2.split(":");

            let [hour2, min2] = timeVal2.split(":");

            let nextMin =
                min === "59"
                    ? "00"
                    : String(Number(min2) + 1).padStart(2, "0");
            
            let nextHour = 
                min === "59"
                    ? String((Number(hour2) + 1) % 24).padStart(2, "0") // wrap around to 00 if hour == 23
                    : hour;

            setArr([...arr, {_key: nanoid(), id: Date.now(), status: "Empty", activity: "", timeValue: `${timeVal2}`, timeValue2: `${nextHour}:${nextMin}`, editingVal: false, editingVal2: false}]);
        }
    }

    const handleEdit = (theIndex: number, theId: number) => {
        const updateArr = arr.map(item => item.id === theId ? { ...item, status: "Editing"} : item)

        console.log(updateArr[theIndex].status);

        setArr(updateArr);

        console.log(updateArr);
    }

    // Convert total minutes to "HH:MM"
    function toTimeString(totalMinutes: number) {
    const h = Math.floor(totalMinutes / 60) % 24;
        const m = totalMinutes % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }

    function updateTimes(times: string[], changedIndex: number, newTime: string): string[]{
        const oldTime = times[changedIndex];
        const diff = toMinutes(newTime) - toMinutes(oldTime);

        // Create new array with updated times
        return times.map((time, index) => {
            if (index < changedIndex) return time; // No change

            const updated = toMinutes(time) + diff;
            return toTimeString(updated);
        });
    }

    const handleUpdate = (theIndex: number, theId: number) => {
        let actVal = (document.getElementById(`activity${theIndex}`) as HTMLInputElement )?.value

        if(arr.length - 1 != theIndex){
            
            if(arr[theIndex]?.editingVal){
                let timeVal = (document.getElementById(`input${theIndex}`) as HTMLInputElement)?.value

                const currentTimeDiff = toMinutes(arr[theIndex]?.timeValue2) - toMinutes(timeVal);

                console.log(`Current Time Diff: ${toMinutes(arr[theIndex]?.timeValue2)} - ${toMinutes(timeVal)}`);

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
    
                console.log("========================================================================================")
                console.log("currentTimes: ", currentTimes);
                console.log("========================================================================================")
                
                const updated = updateTimes(currentTimes, theIndex, timeVal);
    
                console.log("")
                console.log("*========================================================================================")
                console.log(updated)
                console.log("*========================================================================================")
                console.log("")
                
                const totalMinutesSoFar = arr.reduce((sum, item) => {
                    return sum + getTimeDifferenceInDayCycle(item.timeValue, item.timeValue2);
                }, 0);

                const fromMin = toMinutes(arr[theIndex]?.timeValue);
                const toMin = toMinutes(timeVal);
                const toMin2 = toMinutes(arr[theIndex]?.timeValue);

                const addedDuration = (toMin - fromMin);
                const addedDuration2 = (toMin2 - fromMin + 1440) % 1440;

                const newTotal = totalMinutesSoFar + addedDuration;

                console.log("")
                console.log(`fromMin(${fromMin}) - toMin${toMin} = ${toMin - fromMin}`)
                console.log("")

                // console.log(`The real new total: ${newTotal}`)
            
                console.log("Total Minutes: ", totalMinutes)
                console.log(`addedDuration: ${addedDuration}`);

                if((totalMinutes + addedDuration) > 1440){
                    if(fromMin > toMin && theIndex == 0){
                        const updateArr = arr.map((item,index) => item.id == theId ? {...item, timeValue: updated[index], editingVal: false, activity: actVal, status: 'Done', timeValue2: updated[index + 1]} : index != arr.length - 1 ? ({...item, timeValue: updated[index], timeValue2: updated[index + 1], editingVal: false}) : ({...item, timeValue: updated[index], editingVal: false}));
        
                        setArr(updateArr);
                        recalculateTotalMinutes(updateArr)
                    }else{
                        toast.error("Total schedule exceeds 24 hours. abcdefg");
                        return;
                    }
                    // const updateArr = arr.map((item,index) => item.id == theId ? {...item, timeValue: updated[index], editingVal: false, activity: actVal, status: 'Done', timeValue2: updated[index + 1]} : index == arr.length - 1 ? ({...item, editingVal: false}) : index == arr.length - 2 ? ({...item, timeValue: updated[index], editingVal: false}) : index != arr.length - 1 ? ({...item, timeValue: updated[index], timeValue2: updated[index + 1], editingVal: false}) : ({...item, timeValue: updated[index], editingVal: false}));
        
                    // setArr(updateArr);
                }else{
                    const updateArr = arr.map((item,index) => item.id == theId ? {...item, timeValue: updated[index], editingVal: false, activity: actVal, status: 'Done', timeValue2: updated[index + 1]} : index != arr.length - 1 ? ({...item, timeValue: updated[index], timeValue2: updated[index + 1], editingVal: false}) : ({...item, timeValue: updated[index], editingVal: false}));
        
                    setArr(updateArr);
                    recalculateTotalMinutes(updateArr)
                }

            }else if(arr[theIndex]?.editingVal2){
                let timeVal2 = (document.getElementById(`nextInput${theIndex}`) as HTMLInputElement)?.value

                // Get all the current time:
                const currentTimes = arr.map((item: {timeValue: string}) => item.timeValue);
                const updated = updateTimes(currentTimes, theIndex, arr[theIndex]?.timeValue);
                const updateArr = arr.map((item,index) => item.id == theId ? {...item, timeValue: updated[index], editingVal: false, activity: actVal, status: 'Done', timeValue2: updated[index + 1]} : index != arr.length - 1 ? ({...item, timeValue: updated[index], timeValue2: updated[index + 1], editingVal: false}) : ({...item, timeValue: updated[index], editingVal: false}));

                const durationTimes = updateArr.map((item: {timeValue2: string}) => item.timeValue2);
                const updatedDuration = updateTimes(durationTimes, theIndex, timeVal2);

                const updateArr2 = updateArr.map((item, index) => index < theIndex ? {...item, timeValue: updated[index], timeValue2: updatedDuration[index], editingVal2: false} : item.id == theId ? {...item, status: 'Done', timeValue2: updatedDuration[index], editingVal2: false, activity: actVal} : index != arr.length - 1 ? {...item, timeValue: updatedDuration[index - 1], timeValue2: updatedDuration[index], editingVal2: false} : {...item, timeValue: updatedDuration[index - 1], timeValue2: updatedDuration[index], editingVal2: false})

                setArr(updateArr2);
            }else{
                console.log("This is for the first index of array...");

                const updateArr3 = arr.map(item => item.id == theId ? {...item, activity: actVal, status: 'Done'} : item);
            
                setArr(updateArr3);
            }
        }else{
            const updatedArr4 = arr.map(item => item.id === theId ? {...item, activity: actVal, status: 'Done'} : item);

            setArr(updatedArr4);
        }
    }

    const handleCancel = (theIndex: number, theId: number) => {
        const updateArr = arr.map(item => item.id === theId ? { ...item, status: "Done", editingVal: false, editingVal2: false} : item)

        console.log(updateArr[theIndex].status);

        setArr(updateArr);

        console.log(updateArr);
    }

    const recalculateTotalMinutes = (updatedArr: Entry[]) => {
        const total = updatedArr.reduce((sum, item) => {
            return sum + getTimeDifferenceInDayCycle(item.timeValue, item.timeValue2);
        }, 0);
        setTotalMinutes(total);

        console.log("The total: ", total);
        return total;
    };

    const handleDelete = (theIndex: number, theId: number) => {
        const itemToDelete = arr.find(item => item.id === theId);
        if (!itemToDelete) return;

        const timeRemoved = getTimeDifferenceInDayCycle(itemToDelete.timeValue, itemToDelete.timeValue2);
        
        console.log("total time removed: ", timeRemoved);
        
        console.log("There's a problem on the last index, it don't recalibrate the setTimeout when you deleted that last index of a full 1439 totalMinutes")

        
        // return;
        
        const updatedArr = arr.filter(item => item.id !== theId);
        setArr(updatedArr);
        
        console.log(totalMinutes);
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
        if(title){
            setTitle(null);
        }else{
            const title = (document.getElementById("theTitle") as HTMLInputElement)?.value
    
            setTitle(title);
    
            console.log("testing")
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
            const response = await UpdateEdit(id, title, allTime)

            console.log('Updated:', response);
        
            toast.success("Updated Successfully...")

            router.push(`/schedule/${id}`)
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

  return (
    <div className='mt-[10px] p-5 flex flex-col gap-3' id="theForm">
        {title ? (
            <div className='shadow-xl rounded p-5 mb-3 flex gap-2 justify-between'>
                <h1 className='text-white font-bold text-3xl flex items-center'>Title: {title}</h1>
                <div>
                    <button onClick={()=>handleAddTitle()} type='button' className='bg-blue-500 p-2 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                        <Pencil className='text-[rgb(22,22,22)]'/>
                    </button>
                </div>
            </div>
        ) : (
            <div className='flex gap-2 items-center mb-5'>
                <h1 className='text-white font-bold text-3xl flex items-center'>Title: </h1>
                <input 
                    id="theTitle" 
                    type="text" 
                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    autoComplete='off' 
                    placeholder='What title should this schedule have?' 
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
            </div>
            
        )}
        
        { arr.length === 0 ? 
            (
                <button onClick={()=>handleStart()} type='button' className='bg-green-400 p-2 rounded-xl w-full flex justify-center -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                    <Plus className='text-[rgb(22,22,22)]'/>
                </button>
            ) : arr.length === 1 ?
            arr.map((item, index) => (
                <div key={item?.id} className='flex items-center gap-3 border border-white p-5 rounded justify-between'>
                    { item.status === "Empty" || item.status === "Editing" ? (
                            <>
                                <div className='relative'>
                                    <input 
                                        type="time" 
                                        id={`input${index}`} 
                                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
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
                                    <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                        <Clock className='text-white' size={20}/>
                                    </div>
                                </div>

                                <h1 className='text-white font-bold'>to</h1>

                                <div className='relative'>
                                    <input 
                                        type="time" 
                                        id={`nextInput${index}`} 
                                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        min={index > 0 ? arr[index - 1].timeValue : "00:00"} 
                                        defaultValue={item.timeValue} 
                                        onKeyDown={(e)=>{
                                            if(e.key === "Enter"){
                                                e.preventDefault();
                                                handleAdd(index, item?.id)
                                            }
                                        }}
                                        required />
                                    <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                        <Clock className='text-white' size={20}/>
                                    </div>
                                </div>

                                <h1 className='text-white font-bold'>:</h1>

                                <input 
                                    id={`activity${index}`} 
                                    type="text" 
                                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
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
                            </>
                        ) : 
                            <div className='flex items-center gap-3'>
                                <h1 className='text-white font-bold text-3xl flex items-center whitespace-nowrap'>
                                    {to12Hour(item.timeValue)}
                                </h1>
                                
                                <span className='text-lg font-normal text-white'> to </span>
                                
                                <h1 className='text-white font-bold text-3xl flex items-center whitespace-nowrap'>
                                    {to12Hour(item.timeValue2)}
                                </h1>
                                
                                <h1 className='text-white font-bold text-3xl flex items-center'>
                                    :
                                </h1>
                                
                                <p className='text-white font-normal text-3xl inline-block whitespace-normal break-all'>{item.activity}</p>
                            </div>
                    }
                    
                    { item.status === "Empty" ? (
                            <>
                                <button onClick={()=>handleAdd(index, item?.id)} type='button' className='bg-green-400 p-2 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                                    <Plus className='text-[rgb(22,22,22)]'/>
                                </button>
                            </>
                        ) : item.status === "Done" ? (
                            <div className='flex items-center gap-2'>
                                <button onClick={()=>handleEdit(index, item?.id)} type='button' className='bg-blue-500 p-2 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                                    <Pencil className='text-[rgb(22,22,22)]'/>
                                </button>
                                <button onClick={()=>handleModal(index, item?.id)} type='button' className='bg-red-500 p-2 rounded-xl cursor-pointer -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                                    <Trash2 className='text-[rgb(22,22,22)]'/>
                                </button>
                            </div>
                        ) : (
                            <>
                                <button onClick={()=>handleUpdate(index, item?.id)} type='button' className='bg-green-400 p-2 rounded-xl'>
                                    <Check className='text-[rgb(22,22,22)]'/>
                                </button>
                                <button onClick={()=>handleUpdate(index, item?.id)} type='button' className='bg-red-400 p-2 rounded-xl'>
                                    <X className='text-[rgb(22,22,22)]'/>
                                </button>
                            </>
                        )
                    }
                </div>
            )) : (
                arr.map((item, index)=> totalMinutes != 1440 ? (
                    <div key={item?.id} className='flex items-center gap-3 border border-white p-5 rounded justify-between'>
                        { item.status === "Empty" ? (
                                <>
                                    <h1 className='text-white whitespace-nowrap'>{to12Hour(item.timeValue)}</h1>

                                    <h1 className='text-white font-bold'>to</h1>

                                    <div className='relative'>
                                        <input 
                                            type="time" 
                                            id={`nextInput${index}`} 
                                            className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            min={index > 0 ? arr[index - 1].timeValue : "00:00"} 
                                            defaultValue={item.timeValue2} 
                                            onKeyDown={(e)=>{
                                                if(e.key === "Enter"){
                                                    e.preventDefault();
                                                    handleAdd(index, item?.id);
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
                                        autoFocus
                                        id={`activity${index}`} 
                                        type="text" 
                                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        defaultValue={item.activity} 
                                        autoComplete='off' 
                                        onKeyDown={(e)=>{
                                            if(e.key === "Enter"){
                                                e.preventDefault();
                                                handleAdd(index, item?.id);
                                            }
                                        }}
                                        required
                                        placeholder='What will you be doing abcdefg during this time?'  
                                    />
                                </>
                            ) : item.status === "Editing" ? (
                                <>  
                                    {item.editingVal ? (
                                        <>
                                            <div className='relative'>
                                                <input type="time" id={`input${index}`} className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min={index > 0 ? arr[index - 1].timeValue : "00:00"} defaultValue={item.timeValue} required />
                                                <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                                    <Clock className='text-white' size={20}/>
                                                </div>
                                            </div>

                                            <h1 className='text-white font-bold text-4xl flex gap-1 items-center whitespace-nowrap'>
                                                <span className='text-lg font-normal mx-2'> to </span>
                                                    
                                                {to12Hour(item.timeValue2)}
                                            </h1>
                                        </>
                                    ) : item.editingVal2 ? ( 
                                        <>
                                            <h1 className='text-white font-bold text-4xl flex gap-1 items-center whitespace-nowrap'>
                                                {to12Hour(item.timeValue)}
                                                
                                                <span className='text-lg font-normal mx-2'> to </span>
                                            </h1>

                                            <div className='relative'>
                                                <input type="time" id={`nextInput${index}`} className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min={index > 0 ? arr[index - 1].timeValue : "00:00"} defaultValue={item.timeValue2} required />
                                                <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                                    <Clock className='text-white' size={20}/>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className='flex'>
                                            <h1 className='text-white font-bold text-3xl flex gap-1 items-center whitespace-nowrap'>
                                                <button onClick={()=>handleEditVal(index, item?.id)} type='button' className='bg-blue-500 p-3 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer text-[rgb(22,22,22)]'>
                                                    {to12Hour(item.timeValue)}
                                                </button>

                                                <span className='text-lg font-normal mx-2'> to </span>
                                                
                                                <button onClick={()=>handleEditVal2(index, item?.id)} type='button' className='bg-blue-500 p-3 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer text-[rgb(22,22,22)]'>
                                                    {to12Hour(item.timeValue2)}
                                                </button>
                                            </h1>
                                        </div>
                                    )}

                                    <h1 className='text-white font-bold'>:</h1>

                                    <input 
                                        id={`activity${index}`} 
                                        type="text" 
                                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        defaultValue={item.activity} 
                                        autoComplete='off' 
                                        onKeyDown={(e)=>{
                                            if(e.key === "Enter"){
                                                e.preventDefault();
                                                handleUpdate(index, item?.id)
                                            }
                                        }}
                                        required
                                        placeholder='What will you be doing during this time?'
                                    />
                                </>
                            ) : (
                                <div className='flex items-center gap-3'>
                                    <h1 className='text-white font-bold text-3xl flex items-center whitespace-nowrap'>
                                        {to12Hour(item.timeValue)}
                                    </h1>
                                    
                                    <span className='text-lg font-normal text-white'> to </span>
                                    
                                    <h1 className='text-white font-bold text-3xl flex items-center whitespace-nowrap'>
                                        {to12Hour(item.timeValue2)}
                                    </h1>
                                    
                                    <h1 className='text-white font-bold text-3xl flex items-center'>
                                        :
                                    </h1>
                                    
                                    <p className='text-white font-normal text-3xl inline-block whitespace-normal break-all'>{item.activity}</p>
                                </div>
                            )
                        }
                        
                        { item.status === "Empty" ? (
                                <>
                                    <button onClick={()=>handleAdd(index, item?.id)} type='button' className='bg-green-400 p-2 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                                        <Plus className='text-[rgb(22,22,22)]'/>
                                    </button>
                                    <button onClick={()=>handleDelete(index, item?.id)} type='button' className='bg-red-400 p-2 rounded-xl cursor-pointer'>
                                        <X className='text-[rgb(22,22,22)]'/>
                                    </button>
                                </>
                            ) : item.status === "Done" ? (
                                <div className='flex items-center gap-2'>
                                    <button onClick={()=>handleEdit(index, item?.id)} type='button' className='bg-blue-500 p-2 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                                        <Pencil className='text-[rgb(22,22,22)]'/>
                                    </button>
                                    <button onClick={()=>handleModal(index, item?.id)} type='button' className='bg-red-500 p-2 rounded-xl cursor-pointer -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                                        <Trash2 className='text-[rgb(22,22,22)]'/>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button onClick={()=>handleUpdate(index, item?.id)} type='button' className='bg-green-400 p-2 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                                        <Check className='text-[rgb(22,22,22)]'/>
                                    </button>
                                    <button onClick={()=>handleCancel(index, item?.id)} type='button' className='bg-red-500 p-2 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                                        <X className='text-[rgb(22,22,22)]'/>
                                    </button>
                                </>
                            )
                        }
                    </div>
                ) : index != arr.length - 1 ? (
                    <div key={item?.id} className='flex items-center gap-3 border border-white p-5 rounded justify-between'>
                        { item.status === "Empty" && totalMinutes != 1440 ? (
                                <>
                                    <h1 className='text-white whitespace-nowrap'>{to12Hour(item.timeValue)}</h1>

                                    <h1 className='text-white font-bold'>to</h1>

                                    <div className='relative'>
                                        <input type="time" id={`nextInput${index}`} className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min={index > 0 ? arr[index - 1].timeValue : "00:00"} defaultValue={item.timeValue2} required />
                                        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                            <Clock className='text-white' size={20}/>
                                        </div>
                                    </div>

                                    <h1 className='text-white font-bold'>:</h1>

                                    <input 
                                        id={`activity${index}`} 
                                        type="text" 
                                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        defaultValue={item.activity} 
                                        autoComplete='off'
                                        placeholder='What will you be doing during this time?'
                                        required
                                    />
                                </>
                            ) : item.status === "Editing" ? (
                                <>  
                                    {item.editingVal ? (
                                        <>
                                            <div className='relative'>
                                                <input type="time" id={`input${index}`} className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min={index > 0 ? arr[index - 1].timeValue : "00:00"} defaultValue={item.timeValue} required />
                                                <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                                    <Clock className='text-white' size={20}/>
                                                </div>
                                            </div>

                                            <h1 className='text-white font-bold text-4xl flex gap-1 items-center whitespace-nowrap'>
                                                <span className='text-lg font-normal mx-2'> to </span>
                                                    
                                                {to12Hour(item.timeValue2)}
                                            </h1>
                                        </>
                                    ) : item.editingVal2 ? ( 
                                        <>
                                            <h1 className='text-white font-bold text-4xl flex gap-1 items-center whitespace-nowrap'>
                                                {to12Hour(item.timeValue)}
                                                
                                                <span className='text-lg font-normal mx-2'> to </span>
                                            </h1>

                                            <div className='relative'>
                                                <input type="time" id={`nextInput${index}`} className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min={index > 0 ? arr[index - 1].timeValue : "00:00"} defaultValue={item.timeValue2} required />
                                                <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                                    <Clock className='text-white' size={20}/>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className='flex'>
                                            <h1 className='text-white font-bold text-4xl flex gap-1 items-center whitespace-nowrap'>
                                                <button onClick={()=>handleEditVal(index, item?.id)} type='button' className='bg-blue-500 p-3 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer text-[rgb(22,22,22)]'>
                                                    {to12Hour(item.timeValue)}
                                                </button>

                                                <span className='text-lg font-normal mx-2'> to </span>
                                                
                                                <button onClick={()=>handleEditVal2(index, item?.id)} type='button' className='bg-blue-500 p-3 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer text-[rgb(22,22,22)]'>
                                                    {to12Hour(item.timeValue2)}
                                                </button>
                                            </h1>
                                        </div>
                                    )}

                                    <h1 className='text-white font-bold'>:</h1>

                                    <input 
                                        id={`activity${index}`} 
                                        type="text" 
                                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        defaultValue={item.activity} 
                                        autoComplete='off' 
                                        required
                                        onKeyDown={(e)=>{
                                            if(e.key === "Enter"){
                                                e.preventDefault();
                                                handleUpdate(index, item?.id)
                                            }
                                        }}
                                        placeholder="What will you be doing during this time?"
                                    />
                                </>
                            ) : (
                                <div className='flex items-center gap-3'>
                                    <h1 className='text-white font-bold text-3xl flex items-center whitespace-nowrap'>
                                        {to12Hour(item.timeValue)}
                                    </h1>
                                    
                                    <span className='text-lg font-normal text-white'> to </span>
                                    
                                    <h1 className='text-white font-bold text-3xl flex items-center whitespace-nowrap'>
                                        {to12Hour(item.timeValue2)}
                                    </h1>
                                    
                                    <h1 className='text-white font-bold text-4xl flex items-center'>
                                        :
                                    </h1>
                                    
                                    <p className='text-white font-normal text-4xl inline-block whitespace-normal break-all'>{item.activity}</p>
                                </div>
                            )
                        }
                        
                        { item.status === "Empty" && totalMinutes != 1440 ? (
                                <button onClick={()=>handleAdd(index, item?.id)} type='button' className='bg-green-400 p-2 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                                    <Plus className='text-[rgb(22,22,22)]'/>
                                </button>
                            ) : item.status === "Done" || (item.status === "Empty" && totalMinutes == 1440) ? (
                                <div className='flex items-center gap-2'>
                                    <button onClick={()=>handleEdit(index, item?.id)} type='button' className='bg-blue-500 p-2 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                                        <Pencil className='text-[rgb(22,22,22)]'/>
                                    </button>
                                    <button onClick={()=>handleModal(index, item?.id)} type='button' className='bg-red-500 p-2 rounded-xl cursor-pointer -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                                        <Trash2 className='text-[rgb(22,22,22)]'/>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button onClick={()=>handleUpdate(index, item?.id)} type='button' className='bg-green-400 p-2 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                                        <Check className='text-[rgb(22,22,22)]'/>
                                    </button>
                                    <button onClick={()=>handleCancel(index, item?.id)} type='button' className='bg-red-500 p-2 rounded-xl -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                                        <X className='text-[rgb(22,22,22)]'/>
                                    </button>
                                </>
                            )
                        }
                    </div>
                ) : null)
            )
        }

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
                            <button onClick={()=>handleStart()} type='button' className='bg-green-400 p-2 rounded-xl w-full flex justify-center -translate-y-0.5 hover:translate-none duration-500 cursor-pointer'>
                                <Plus className='text-[rgb(22,22,22)]'/>
                            </button>
                        }
                        <button 
                            onClick={()=>handleSubmit(isPending)} 
                            className={`text-[rgb(22,22,22)] mt-2 rounded p-5 font-bold ${isPending ? 'bg-green-300' : '-translate-y-2 hover:translate-none duration-500 bg-green-400 hover:cursor-pointer'} `}
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
    </div>
    )
}

export default Addtime
