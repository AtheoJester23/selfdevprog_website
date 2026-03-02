"use client"

import { createNote } from "@/lib/actions";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const Page = () => {
    const theInput = useRef<HTMLTextAreaElement>(null);
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    useEffect(()=>{
        theInput.current?.focus();
    },[])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const description = formData.get("description") as string;

        console.log(description)

        if(!description || description.replace(/[ ]/g, "") == ""){
            toast.error("There's nothing to submit.")
            return;
        }

        try {
            setLoading(true)

            const res = await createNote(description);

            if(res.error.trim() != ""){
                throw res.error;
            }

            router.push("/dashboard")
                
            toast.success("Schedule Created");
        } catch (error) {
            console.error((error as Error).message)
            toast.error("Failed to submit note.")
        }finally{
            setLoading(false)
        }
    }
    
    return ( 
        <>
            <div className="h-screen w-full flex items-center sm:pt-[65px]">
                <form onSubmit={(e) => handleSubmit(e)} className="bg-white w-full m-5 p-5 rounded-xl h flex flex-col gap-5">
                    <textarea name="description" id="description" rows={18} className="w-full rounded-xl" ref={theInput}></textarea>
                
                    <div className="flex justify-end">
                    {!loading ? (
                        <button type="submit" className="border border-gray-500 rounded py-2 px-5 -translate-y-1 hover:translate-none cursor-pointer duration-200 font-bold shadow-sm hover:shadow-none">Done</button>
                    ):(
                        <button type="button" className="bg-blue-300 rounded py-2 px-5 -translate-y-1 cursor-pointer duration-200 font-bold shadow-sm hover:shadow-none">Loading</button>
                    )}
                    </div>
                </form>
            </div> 
            <ToastContainer theme="dark"/>
        </>
    );
}
 
export default Page;