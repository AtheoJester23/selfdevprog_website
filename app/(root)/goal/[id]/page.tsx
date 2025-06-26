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

    const goalDetails: goalType[] = await client.fetch(GOALS_BY_ID, {id})
  return (
    <div className='mb-20'>
      <GoalPage goalDeets={goalDetails} id={id}/>
    </div>
  )
}

export default page
