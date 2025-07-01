import { auth } from '@/auth';
import ActionButtons from '@/components/ActionButtons';
import { Entry } from '@/components/Addtime';
import { to12Hour } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { SCHEDULE_BY_ID } from '@/sanity/lib/queries';
import { redirect } from 'next/navigation';

export interface scheds {
  title: string;
  _id: string;
  _createdAt: string;
  user: {
    _id: string;
    image: string;
    name: string;
  };
  allTime: Entry[];
}

export type paramsType = Promise<{id: string}>

export default async function Page(prop: { params: paramsType}) {
  const session = await auth();

  if (!session) redirect('/');

  const { id } = await prop.params;

  const schedule: scheds[] = await client.fetch(SCHEDULE_BY_ID, { id });

  return (
    <div className="mt-[80px] p-5 printable-area">

      <article>

        <section className="flex flex-col gap-3">
          <div className='flex justify-center items-center mb-[30px]'>
            <h1 className="text-white text-2xl md:text-5xl font-bold theTitle text-center break-all">
              {schedule[0]?.title ?? 'Untitled'}
            </h1>
          </div>
          
          <ul className='flex flex-col gap-3'>
            {schedule[0]?.allTime?.map((item: Entry) => (
              <li
                key={item.id}
                className="border-y border-white flex flex-col sm:flex-row items-center sm:gap-1 md:gap-5 justify-start shadow-xl"
              >
                <div className="time bg-white h-full items-center">
                  <h1 className="bg-white p-2 md:p-5 text-[rgb(22,22,22)] sm:text-3xl md:text-3xl lg:text-3xl font-bold whitespace-nowrap flex items-center gap-3">
                    {to12Hour(item.timeValue)}{' '}
                    <span className="text-[rgb(22,22,22)] text-sm">to</span>{' '}
                    {to12Hour(item.timeValue2)}
                  </h1>
                </div>
                <div className="py-3 action">
                  <h1 className="text-white mb-2 md:mb-none sm:text-3xl font-bold break-all">
                    {item.activity}
                  </h1>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </article>

      <ActionButtons id={id} />
    </div>
  );
}
