"use client"

import React, { useEffect, useRef } from "react";

const page = () => {
    let theInput = useRef<HTMLTextAreaElement>(null);

    useEffect(()=>{
        theInput.current?.focus();
    },[])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        let text = document.getElementById("description") as HTMLTextAreaElement

        console.log(text.value)
    }

    function test(){
        const descriptionInp = (document.getElementById('description')) as HTMLTextAreaElement;

        console.log(descriptionInp.value);
    }
    
    return ( 
        <div className="h-screen w-full flex items-center sm:pt-[65px]">
            <form onSubmit={(e) => handleSubmit(e)} className="bg-white w-full m-5 p-5 rounded-xl h flex flex-col gap-5">
                <textarea name="description" id="description" rows={18} className="w-full rounded-xl" ref={theInput}></textarea>
            
                <div className="flex justify-end">
                    <button type="submit" className="border border-gray-500 rounded py-2 px-5 -translate-y-1 hover:translate-none cursor-pointer duration-200 font-bold shadow-sm hover:shadow-none">Done</button>
                </div>
            </form>
        </div> 
    );
}
 
export default page;