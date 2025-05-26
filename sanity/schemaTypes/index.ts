import { type SchemaTypeDefinition } from 'sanity'
import { schedule } from './schedules'
import { timeBlock } from './timeBlock'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [schedule, timeBlock],
}
