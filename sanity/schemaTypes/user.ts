import { UserIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import { goallist } from "./goallist";

export const user = defineType({
    name: "user",
    title: "User",
    type: 'document',
    icon: UserIcon,
    fields: [
        defineField({
            name: 'id',
            type: 'string'
        }),
        defineField({
            name: 'name',
            type: 'string'
        }),
        defineField({
            name: 'username',
            type: 'string'
        }),
        defineField({
            name: 'email',
            type: 'string'
        }),
        defineField({
            name: 'image',
            type: 'url'
        }),
        defineField({
            name: 'quote',
            type: 'text'
        }),
        defineField({
            name: 'goals',
            type: 'array',
            of: [
                    {
                        name: "goal",
                        title: "Goal",
                        type: "object",
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
                        ]
                    }
                ]
        })
    ],
    preview: {
        select: {
            title: 'name'
        }
    }
})