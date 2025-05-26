"use server"

import { auth } from "@/auth"
import { error } from "console";
import { wholeData } from "@/components/Addtime";
import { toast } from "react-toastify";
import { writeClient } from "@/sanity/lib/write-client";
import { parseServerActionResponse } from "./utils";

export const createSchedule = async (data: wholeData) => {
    const session = await auth();

    if(!session){
        return parseServerActionResponse({
            error: "Not signed in",
            status: "ERROR"
        })
    }

    try {
        const result = await writeClient.create({_type: "schedule", ...data})
    
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
