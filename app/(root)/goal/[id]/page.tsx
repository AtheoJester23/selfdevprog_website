import { paramsType } from '../../schedule/[id]/page'
import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import { GOALS_BY_ID } from '@/sanity/lib/queries';
import { goalType } from '@/components/goal/Goalform';
import GoalPage from '@/components/goal/GoalPage';
import { client } from '@/sanity/lib/client';

const page = async ({params}: {params: paramsType}) => {
    const session = await auth();

    if(!session) redirect('/')

    const { id } = await params;

    console.log("You have to make this live fetching to be able to display realtime, or you can take the long way where you'll utilize state management")
    const goalDetails: goalType[] = await client.fetch(GOALS_BY_ID, {id})

    console.log(goalDetails);
  return (
    <div className='mb-20'>
      <GoalPage goalDeets={goalDetails} id={id}/>
    </div>
  )
}

export default page
