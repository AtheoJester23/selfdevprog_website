"use client"

const page = () => {
    function test(){
        const titleInp = (document.getElementsByName('title')[0]) as HTMLInputElement;
        const descriptionInp = (document.getElementById('description')) as HTMLTextAreaElement;


        console.log(titleInp.value);
        console.log(descriptionInp.value);
    }
    
    return ( 
        <>
            <ul>
                <p>Testing</p>
            </ul>
        </> 
    );
}
 
export default page;