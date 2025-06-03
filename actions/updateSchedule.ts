'use server'

import { Entry } from "@/components/Addtime";
import { client } from "@/sanity/lib/client";

export async function UpdateEdit(id: string, title: string, arr: Entry[]){
    try {
        const response = await client
            .patch(id)
            .set({title, allTime: arr })
            .commit(); // commit the update
        return{success:true}
    } catch (error) {
        console.error('Update failed:', error);
        return {success: false, error: (error as Error).message}
    }
};
