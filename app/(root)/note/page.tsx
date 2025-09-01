export type typeNotes = {
    _id: string,
    title: string,
    message: string
}

const page = async ({prop}: {prop: typeNotes}) => {
    console.log(prop)
    
    return ( 
        <>
            <ul>
                <p>Testing</p>
            </ul>
        </> 
    );
}
 
export default page;