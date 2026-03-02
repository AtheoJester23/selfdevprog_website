"use server"

import { auth } from "@/auth"
import { wholeData } from "@/components/Addtime";
import { toast } from "react-toastify";
import { writeClient } from "@/sanity/lib/write-client";
import { parseServerActionResponse } from "./utils";
import { goalDeets } from "@/app/(root)/goal/page";
import { client } from "@/sanity/lib/client";
import { typeNotes } from "@/components/notes/UserNotes";

export const createSchedule = async (data: wholeData) => {
    const session = await auth();

    if(!session){
        return parseServerActionResponse({
            error: "Not signed in",
            status: "ERROR"
        })
    }

    try {
        const submitData = {
            ...data, 
            user: {
                _type: 'reference',
                _ref: session?.id
            },
        }

        const result = await writeClient.create({_type: "schedule", ...submitData})
    
        return parseServerActionResponse({
            ...result,
            error: '',
            status: "SUCCESS"
        })
    } catch (error) {
        toast.error((error as Error).message);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR"
        })
    }
}

export const createGoal = async (data: goalDeets) => {
    const session = await auth();

    if(!session){
        return parseServerActionResponse({
            error: "Not signed in",
            status: "ERROR"
        })
    }

    try {
        const submitData = {
            ...data, 
            user: {
                _type: 'reference',
                _ref: session?.id
            },
        }

        const result = await writeClient.create({_type: "goals", ...submitData})
    
        return parseServerActionResponse({
            ...result,
            error: '',
            status: "SUCCESS"
        })
    } catch (error) {
        toast.error((error as Error).message);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR"
        })
    }
}

export const createNote = async (message: string) => {
    const session = await auth();

    if(!session){
        return parseServerActionResponse({
            error: "Not signed in",
            status: "ERROR"
        })
    }

    try {
        const submitData = {
            message,
            user: {
                _type: 'reference',
                _ref: session?.id
            }
        }

        const result = await writeClient.create({_type: "notes", ...submitData})

        return parseServerActionResponse({
            ...result,
            error: '',
            status: "SUCCESS"
        })
    } catch (error) {
        toast.error((error as Error).message);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR"
        })
    }
}

export const updateNote = async (id: string, initialData: typeNotes, message: string) => {
    const session = await auth();

    if(!session){
        return parseServerActionResponse({
            error: "Not signed in",
            status: "ERROR"
        })
    }

    try {

        console.log(initialData);


        console.log('this')
         
        const result = await client.patch(id).set({message}).commit(); 

        return parseServerActionResponse({
            ...result,
            error: '',
            status: "SUCCESS"
        })
    } catch (error) {
        toast.error((error as Error).message);

        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR"
        })
    }
}

export const deleteNote = async (id:string) => {
    try {
        await client.delete(id)
        return{success:true}
    } catch (error) {
        return {success: false, error: (error as Error).message}
    }
}