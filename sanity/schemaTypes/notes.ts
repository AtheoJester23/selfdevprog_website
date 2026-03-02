import { defineField, defineType } from "sanity";

export const notes = defineType({
  name: "notes",
  title: "Notes",
  type: "document",
  fields: [
    defineField({
      name: "message",
      title: "Message",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
    }),
  ],
  preview: {
    select: {
      title: "message",
      subtitle: "user.name", // assumes your user schema has a "name" field
    },
  },
});