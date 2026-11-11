import Dexie, { type Table } from 'dexie'
import type { Note } from './types'

class FolioDatabase extends Dexie {
  notes!: Table<Note>

  constructor() {
    super('FolioDB')
    this.version(1).stores({
      notes: '++id, title, *tags, createdAt, updatedAt'
    })
  }
}

export const db = new FolioDatabase()
