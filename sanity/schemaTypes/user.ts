import { UserIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

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
    ],
    preview: {
        select: {
            title: 'name'
        }
    }
})