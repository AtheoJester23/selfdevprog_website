'use server'

import { client } from "@/sanity/lib/client"

export async function deleteSchedule(id:string){
    try {
        await client.delete(id)
        return{success:true}
    } catch (error) {
        return {success: false, error: (error as Error).message}
    }
}