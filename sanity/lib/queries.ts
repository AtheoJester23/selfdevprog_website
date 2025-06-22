import {groq } from "next-sanity";

export const AUTHOR_BY_GOOGLE_ID_QUERY = groq`
        *[_type == "user" && id == $id][0]{
            _id, id, name, username, email
        }
    `;

export const SCHEDULE_BY_AUTHOR_QUERY = groq`
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
    `;


export const SCHEDULE_BY_ID = groq`
        *[_type == "schedule" && _id == $id]{
            title,
            allTime,
            totalMinutes
        }
    `;

export const GOALS_BY_AUTHOR = groq`
    *[_type == "goals" && user._ref == $id]{
        title,
        duration,
        description,
        steps,
        _id
    }
`;

export const GOALS_BY_ID = groq`
    *[_type == "goals" && _id == $id]{
        title,
        duration,
        description,
        steps,
        status
    }
`;