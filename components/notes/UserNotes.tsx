export type typeNotes = {
    _id: string,
    title: string,
    message: string
}

const UserNotes = async ({prop}: {prop: typeNotes[]}) => {
    console.log(prop);
    
    return ( 
        <>
            {prop?.length > 0 ? (
                <ul className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3'>
                    {prop.map((item: typeNotes) => (
                        <li key={item._id}>
                            {item.message}
                        </li>
                    ))}
                </ul>
            ):(
                <p>Testing</p>
            )}
        </> 
    );
}
 
export default UserNotes;