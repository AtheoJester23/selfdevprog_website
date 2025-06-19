import { defineField, defineType } from "sanity";

export const goallist = defineType({
    name: "goals",
    title: "Goals",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
        }),
        defineField({
            name: "duration",
            title: "Duration",
            type: "string",
        }),
        defineField({
            name: "thegoal",
            title: "The Goal",
            type: "string"
        }),
        defineField({
            name: "steps",
            title: "Steps",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({
                            name: "step",
                            title: "Step",
                            type: "string"
                        })
                    ]
                }
            ]
        }),
        // defineField({
        //     name: "user",
        //     title: "User",
        //     type: "reference",
        //     to: [{type: "user"}]
        // })
    ],
    preview: {
        select: {
            title: "title"
        }
    }
})