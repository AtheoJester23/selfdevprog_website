import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { NOTES_BY_ID } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { typeNotes } from "@/components/notes/UserNotes";
import ViewNote from "@/components/notes/ViewNote";

type paramsType = Promise<{id: string}>

const Page = async ({ params }: { params: paramsType }) => {
  const session = await auth();

  if (!session) redirect("/");

  const { id } = await params;

  const theNote: typeNotes[] = await client.fetch(NOTES_BY_ID, { id });

  console.log(theNote[0].message);

  return (
    <div className="mt-[70px] h-screen p-5 w-full grid items-center">
      <div className="bg-white p-5 rounded h-full overflow-auto">
        <ViewNote theNote={theNote} id={id}/>
      </div>
    </div>
  );
};

export default Page;