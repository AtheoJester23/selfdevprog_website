import { type SchemaTypeDefinition } from 'sanity'
import { schedule } from './schedules'
import { user } from './user'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [schedule, user],
}
