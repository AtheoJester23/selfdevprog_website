import {groq } from "next-sanity";

export const AUTHOR_BY_GOOGLE_ID_QUERY = groq`
        *[_type == "user" && id == $id][0]{
            _id, id, name, username, email, quote
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
        status,
        steps,
        picked,
        _id
    }
`;

export const GOALS_BY_ID = groq`
    *[_type == "goals" && _id == $id]{
        _id,
        title,
        duration,
        description,
        steps,
        status,
        picked
    }
`;

export const RECENT_GOALS_BY_AUTHOR = groq`
    *[_type == "goals" && user._ref == $id] | order(_createdAt desc)[0...5]{
        title,
        duration,
        description,
        steps,
        _id
    }
`

export const UPDATE_PICKED_GOALS = groq`
    *[_type == "goals" && title in $titles]{
        _id,
        title,
        duration,
        description,
        steps,
        status,
        picked
    }
`

export const RECENT_SCHEDS_BY_AUTHOR = groq`
        *[_type == "schedule" && user._ref == $id] | order(_createdAt desc)[0...4]{
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