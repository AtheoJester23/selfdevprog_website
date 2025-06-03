import { z } from 'zod'

export const formSchema = z.object({
    title: z.string().min(3).max(50),
    allTime: z.array(
        z.object({
            activity: z.string(),
            editingVal: z.boolean(),
            editingVal2: z.boolean(),
            id: z.number(),
            status: z.string(),
            timeValue: z.string(),
            timeValue2: z.string()
        })
    )
})