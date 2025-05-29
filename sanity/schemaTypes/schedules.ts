import { defineField, defineType } from "sanity";

export const schedule = defineType({
    name: "schedule",
    title: "Schedule",
    type: "document",
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string'
        }),
        defineField({
            name: 'allTime',
            title: 'All Time',
            type: 'array',
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({
                            name: "activity",
                            title: 'Activity',
                            type: "string"
                        }),
                        defineField({
                            name: "editingVal",
                            title: 'Editing Value',
                            type: "boolean"
                        }),
                        defineField({
                            name: "editingVal2",
                            title: "Editing Value 2",
                            type: "boolean"
                        }),
                        defineField({
                            name: "id",
                            title: 'Id',
                            type: "number"
                        }),
                        defineField({
                            name: "status",
                            title: 'Status',
                            type: "string"
                        }),
                        defineField({
                            name: "timeValue",
                            title: 'Time Value',
                            type: "string"
                        }),
                        defineField({
                            name: "timeValue2",
                            title: 'Time Value 2',
                            type: "string"
                        })
                    ]
                }
            ]
        }),
        defineField({
            name: 'user',
            title: 'User',
            type: 'reference',
            to: [{type: 'user'}]
        })
    ],
    preview: {
        select: {
            title: "title",
        }
    }
})