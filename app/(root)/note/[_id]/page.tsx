"use client"

const page = () => {
    function test(){
        const titleInp = (document.getElementsByName('title')[0]) as HTMLInputElement;
        const descriptionInp = (document.getElementById('description')) as HTMLTextAreaElement;


        console.log(titleInp.value);
        console.log(descriptionInp.value);
    }
    
    return ( 
        <div className="h-screen w-full flex items-center sm:pt-[65px]">
            <form className="bg-white w-full m-5 p-5 rounded-xl h flex flex-col gap-5">
                <div className="flex items-center gap-3">
                    <label className="font-bold">Title: </label>
                    <input type="text" name='title' className="rounded w-full"/>
                </div>
                
                <textarea name="description" id="description" rows={18} className="w-full rounded-b-xl"></textarea>
            
                <div className="flex justify-end">
                    <button type="button" onClick={test} className="border border-gray-500 rounded py-2 px-5 -translate-y-1 hover:translate-none cursor-pointer duration-200 font-bold shadow-sm hover:shadow-none">Done</button>
                </div>
            </form>
        </div> 
    );
}
 
export default page;