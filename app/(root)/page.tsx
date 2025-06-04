import { auth } from "@/auth";
import Startbutton from "@/components/Startbutton";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <div className="banner">
        <div className="bannerText flex flex-col gap-5">
            <h1 className="fw-bold hookH1 text-[60px]">Purpose | Clarity | Motivation</h1>
            <div className="flex flex-col gap-1">
              <p className="hookDesc text-[26px]">Lock in fam. Nobody can help you if you don't help yourself. Use this website for Time Management, Journal, Todo list, Workout plan, Stopwatch, Timer, etc...</p>
              <Startbutton isSession={session}/>
            </div>
        </div>
      </div>      
    </>
  );
}
