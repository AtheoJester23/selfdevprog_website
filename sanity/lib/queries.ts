import { defineQuery } from "next-sanity";

export const AUTHOR_BY_GOOGLE_ID_QUERY = defineQuery(`
        *[_type == "user" && id == $id][0]{
            _id, id, name, username, email
        }
    `)

export const SCHEDULE_BY_AUTHOR_QUERY = defineQuery(`
        *[_type == "schedule" && user._ref == $id]{
            _id,
            title,
            _createdAt,
            user -> {
                _id,
                name,
                image
            },
            allTime
        }
    `)


export const SCHEDULE_BY_ID = defineQuery(`
        *[_type == "schedule" && _id == $id]{
            title,
            allTime,
            totalMinutes
        }
    `)