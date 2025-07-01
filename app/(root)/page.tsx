import { auth } from "@/auth";
import Startbutton from "@/components/Startbutton";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <div className="banner relative">
        <div className="absolute flex flex-col gap-5 max-sm:bottom-[110px] sm:bottom-[140px] left-[70px] right-[70px]">
            <h1 className="hookH1 text-[2rem] md:text-[60px]">Purpose | Clarity | Motivation</h1>
            <div className="flex flex-col gap-1">
              <p className="hookDesc text-[16px] md:text-[26px]">No one can help you until you choose to help yourself. This platform is designed to support your personal growth — with tools for time management, journaling, to-do lists, workout planning, a stopwatch, timer, and more.</p>
              <Startbutton isSession={session}/>
            </div>
        </div>
      </div>      
    </>
  );
}
