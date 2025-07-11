"use server"

import { auth } from "@/auth"
import { wholeData } from "@/components/Addtime";
import { toast } from "react-toastify";
import { writeClient } from "@/sanity/lib/write-client";
import { parseServerActionResponse } from "./utils";
import { goalDeets } from "@/app/(root)/goal/page";

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