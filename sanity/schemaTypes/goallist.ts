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
            name: "description",
            title: "Description",
            type: "string"
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'boolean'
        }),
        defineField({
           name: 'picked',
           title: 'Picked',
           type: 'boolean' 
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
                        }),
                        defineField({
                            name: "status",
                            title: "Status",
                            type:"string"
                        })
                    ]
                }
            ]
        }),
        defineField({
            name: "user",
            title: "User",
            type: "reference",
            to: [{type: "user"}]
        })
    ],
    preview: {
        select: {
            title: "title"
        }
    }
})