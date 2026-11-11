import { useState, useEffect, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import type { Note } from './types'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import { Plus, Search, Moon, Sun, Download } from 'lucide-react'

export default function App() {
  const notes = useLiveQuery(() => db.notes.orderBy('updatedAt').reverse().toArray()) ?? []
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [dark, setDark] = useState(true)

  const selectedNote = notes.find(n => n.id === selectedId) ?? null

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      !search ||
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())

    const matchesTag = !activeTag || note.tags.includes(activeTag)

    return matchesSearch && matchesTag
  })

  const allTags = Array.from(
    new Set(notes.flatMap(n => n.tags))
  ).sort()

  const createNote = useCallback(async () => {
    const now = new Date()
    const id = await db.notes.add({
      title: 'Untitled',
      content: '',
      tags: [],
      createdAt: now,
      updatedAt: now,
    })
    setSelectedId(id as number)
    setSearch('')
    setActiveTag(null)
  }, [])

  const updateNote = useCallback(async (id: number, updates: Partial<Note>) => {
    await db.notes.update(id, {
      ...updates,
      updatedAt: new Date(),
    })
  }, [])

  const deleteNote = useCallback(async (id: number) => {
    await db.notes.delete(id)
    if (selectedId === id) {
      setSelectedId(null)
    }
  }, [selectedId])

  const exportNotes = useCallback(() => {
    const data = JSON.stringify(notes, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `folio-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [notes])

  return (
    <div className="h-screen flex flex-col bg-surface-950 text-surface-100">
      {/* Top bar */}
      <header className="h-14 border-b border-surface-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight text-white">Folio</h1>
          <span className="text-xs text-surface-500 hidden sm:inline">local-first notes</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportNotes}
            className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
            title="Export all notes"
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => setDark(d => !d)}
            className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
            title="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={createNote}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-surface-900 text-sm font-medium hover:bg-surface-200 transition-colors"
          >
            <Plus size={16} />
            New note
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-surface-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-surface-800">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-surface-900 border border-surface-700 rounded-lg pl-9 pr-3 py-2 text-sm text-surface-100 placeholder:text-surface-500 focus:outline-none focus:border-surface-500"
              />
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="px-3 py-2 border-b border-surface-800 flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveTag(null)}
                className={`text-xs px-2 py-1 rounded-md transition-colors ${
                  !activeTag
                    ? 'bg-surface-700 text-white'
                    : 'text-surface-400 hover:bg-surface-800'
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                  className={`text-xs px-2 py-1 rounded-md transition-colors ${
                    activeTag === tag
                      ? 'bg-sky-600/30 text-sky-300'
                      : 'text-surface-400 hover:bg-surface-800'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <Sidebar
            notes={filteredNotes}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDelete={deleteNote}
          />
        </aside>

        {/* Main area */}
        <main className="flex-1 overflow-hidden">
          {selectedNote ? (
            <Editor
              note={selectedNote}
              onUpdate={updateNote}
              onDelete={deleteNote}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-surface-500">
              <p className="text-lg mb-2">No note selected</p>
              <p className="text-sm">Create a new note or select one from the sidebar</p>
              <button
                onClick={createNote}
                className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-800 text-surface-200 hover:bg-surface-700 transition-colors"
              >
                <Plus size={16} />
                Create your first note
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
