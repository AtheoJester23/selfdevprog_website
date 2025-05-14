import { auth } from "@/auth";

export default async function Home() {
  return (
    <>
      <div className="mt-[70px] banner">
        <div className="bannerText flex flex-col gap-5">
            <h1 className="fw-bold hookH1 text-[60px]">Purpose | Clarity | Motivation</h1>
            <div className="flex flex-col gap-1">
              <p className="hookDesc text-[26px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat dicta modi, laboriosam incidunt aperiam, magni voluptatem error, quasi iste pariatur cum magnam dignissimos neque debitis in sint repellendus sed. Eligendi.</p>
              <a href="#start" className="button bg-black text-white px-5 py-3 rounded-xl mt-5 w-[200px] text-center -translate-y-1 hover:translate-none duration-200 hover:text-black hover:bg-white font-bold shadow-lg hover:shadow-none">Let's Get Started!</a>
            </div>
        </div>
      </div>      
    </>
  );
}
