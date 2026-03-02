"use client"

import { FormEvent, useState } from "react"
import { typeNotes } from "./UserNotes";
import { deleteNote, updateNote } from "@/lib/actions";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { Dialog, DialogPanel } from "@headlessui/react";

const ViewNote = ({id, theNote}: {id: string, theNote: typeNotes[]}) => {
    const initialValue = theNote?.[0]?.message ?? "";

    const [value, setValue] = useState(initialValue);
    const [changed, setChanged] = useState(false);
    const [loading, setLoading] = useState(false)
    const [del, setDel] = useState(false);

    const router = useRouter();

    const handleUpdateNote = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const message = formData.get("message") as string;

        try {
            setLoading(true)

            const res = await updateNote(id, theNote[0], message);

            if(res.error.trim() != ""){
                throw res.error;
            }

            toast.success("Update complete!")
            
            router.push("/dashboard")
        } catch (error) {
            console.error((error as Error).message)
            toast.error("Failed to update the note.")
        } finally{
            setLoading(false)
        }
    }  
    
    const handleDeleteNote = async (id: string) => {
        try {
            setLoading(true)
            const res = await deleteNote(id);

            if(!res.success){
                throw res.error
            }

            toast.success("Note deleted successfully!");

            router.push("/dashboard");
        } catch (error) {
            console.error((error as Error).message);
            toast.error(`Failed to delete this note.`)
        } finally {
            setLoading(false)
            setDel(false)
        }
    }

    return (
        <>
            <form onSubmit={(e) => handleUpdateNote(e)} className="w-full h-full">
                <textarea
                    value={value}
                    name="message"
                    id="message"
                    onChange={(e) => {
                    const newValue = e.currentTarget.value;
                    setValue(newValue);
                    setChanged(newValue !== initialValue);
                    }}
                    className="w-full h-screen p-3 border rounded resize-none whitespace-pre-wrap"
                />

                {!loading && (
                    <div className="mt-3 flex gap-2 justify-end">
                        <button
                            onClick={() => setDel(true)}
                            type="button"
                            className={`px-5 py-3 rounded bg-red-500 cursor-pointer font-bold text-white`}
                        >
                            Delete
                        </button>

                        { changed ? (
                            <button className="bg-blue-500 px-5 py-3 rounded cursor-pointer font-bold text-white">
                                Update
                            </button>
                        ): !changed && (
                            <div className="bg-blue-300 px-5 py-3 rounded text-gray-500">
                                Update
                            </div>
                        )}
                    </div>
                )}
            </form>
            <ToastContainer theme="dark"/>
            <Dialog open={del} onClose={setDel} className={"fixed top-0 bottom-0 right-0 left-0 flex justify-center items-center"}>
                <DialogPanel>
                    <div className="flex flex-col gap-5 bg-white shadow-xl border border-gray-500 p-5 rounded">
                        <h1>Are you sure you want to delete this note?</h1>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setDel(false)} className="cursor-pointer bg-gray-300 px-5 py-1 rounded text-black">Cancel</button>
                            <button onClick={() => handleDeleteNote(id)} className="cursor-pointer bg-red-500 px-5 py-1 rounded text-white">Delete</button>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </>
    )
}

export default ViewNote
