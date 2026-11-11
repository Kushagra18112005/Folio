import { formatDistanceToNow } from 'date-fns'
import { Trash2 } from 'lucide-react'
import type { Note } from '../types'

interface Props {
  notes: Note[]
  selectedId: number | null
  onSelect: (id: number) => void
  onDelete: (id: number) => void
}

export default function Sidebar({ notes, selectedId, onSelect, onDelete }: Props) {
  if (notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center text-surface-500 text-sm">
        No notes yet
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {notes.map(note => (
        <div
          key={note.id}
          onClick={() => onSelect(note.id!)}
          className={`group relative px-4 py-3 border-b border-surface-800/60 cursor-pointer transition-colors ${
            selectedId === note.id
              ? 'bg-surface-800/80'
              : 'hover:bg-surface-900'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm text-surface-100 truncate">
                {note.title || 'Untitled'}
              </h3>
              <p className="text-xs text-surface-500 mt-0.5 line-clamp-2">
                {note.content.replace(/[#*`\[\]]/g, '').slice(0, 80) || 'Empty note'}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] text-surface-600">
                  {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                </span>
                {note.tags.length > 0 && (
                  <div className="flex gap-1">
                    {note.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-surface-800 text-surface-400"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 2 && (
                      <span className="text-[10px] text-surface-600">+{note.tags.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={e => {
                e.stopPropagation()
                if (confirm('Delete this note?')) {
                  onDelete(note.id!)
                }
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded text-surface-500 hover:text-red-400 hover:bg-surface-700 transition-all"
              title="Delete note"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
