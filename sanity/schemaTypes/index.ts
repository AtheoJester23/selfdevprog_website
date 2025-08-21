import { type SchemaTypeDefinition } from 'sanity'
import { schedule } from './schedules'
import { user } from './user'
import { goallist } from './goallist'
import { notes } from './notes'



export const schema: { types: SchemaTypeDefinition[] } = {
  types: [schedule, user, goallist, notes],
}
