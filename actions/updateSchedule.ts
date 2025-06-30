'use server'

import { goalDeets } from "@/app/(root)/goal/page";
import { userDeets } from "@/app/(root)/profile/editProfile/page";
import { Entry } from "@/components/Addtime";
import { goalType } from "@/components/goal/Goalform";
import { client } from "@/sanity/lib/client";

export async function UpdateEdit(id: string, title: string, arr: Entry[]){
    try {
        const response = await client
            .patch(id)
            .set({title, allTime: arr })
            .commit(); 
        return{success:true}
    } catch (error) {
        console.error('Update failed:', error);
        return {success: false, error: (error as Error).message}
    }
};

export async function UpdateGoal(id: string, goalDetails: goalDeets){
    try {
        const response = await client
            .patch(id)
            .set({...goalDetails})
            .commit(); 
        return{success:true}
    } catch (error) {
        console.error('Update failed:', error);
        return {success: false, error: (error as Error).message}
    }
};

export async function UpdateGoalStatus(id: string, goalDetails: goalType, status: boolean){
    try {
        const response = await client
            .patch(id)
            .set({...goalDetails, status})
            .commit(); 
        return{success:true}
    } catch (error) {
        console.error('Update failed:', error);
        return {success: false, error: (error as Error).message}
    }
};

export async function UpdateUserDetails(id: string, userDetails: userDeets){
    try {
        const response = await client
            .patch(id)
            .set({...userDetails})
            .commit();
        return{success:true}
    } catch (error) {
        console.error('Update failed: ', error);
        return{ success: false, error: (error as Error).message }
    }
}

export async function UpdateGoalPicks(selectedGoals: goalDeets[], state: boolean){
    await Promise.all(
        selectedGoals
            .filter((goal): goal is goalDeets & { _id: string } => typeof goal._id === 'string')
            .map(goal => 
                client.patch(goal._id).set({ picked: state }).commit()
            )
    )
}