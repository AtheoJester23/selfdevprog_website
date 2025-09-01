"use client"

export type typeNotes = {
    _id: string,
    title: string,
    message: string
}

const page = async ({prop}: {prop: typeNotes}) => {    
    return ( 
        <>
            <ul>
                <p>Testing</p>
            </ul>
        </> 
    );
}
 
export default page;