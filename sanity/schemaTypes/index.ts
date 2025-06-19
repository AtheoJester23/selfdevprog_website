import { type SchemaTypeDefinition } from 'sanity'
import { schedule } from './schedules'
import { user } from './user'
import { goallist } from './goallist'



export const schema: { types: SchemaTypeDefinition[] } = {
  types: [schedule, user, goallist],
}
