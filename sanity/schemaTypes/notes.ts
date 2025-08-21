import { defineField, defineType } from "sanity";

export const notes = defineType({
    name: "notes",
    title: "Notes",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
        }),
        defineField({
            name: "message",
            title: "Message",
            type: "string"
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
            title: "title",
        }
    }
    
})