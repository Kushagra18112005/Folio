import { useState, useEffect, useRef } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { Trash2, Eye, Edit3 } from 'lucide-react'
import type { Note } from '../types'
import TagInput from './TagInput'

interface Props {
  note: Note
  onUpdate: (id: number, updates: Partial<Note>) => void
  onDelete: (id: number) => void
}

export default function Editor({ note, onUpdate, onDelete }: Props) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [tags, setTags] = useState<string[]>(note.tags)
  const [showPreview, setShowPreview] = useState(true)
  const saveTimeout = useRef<number | null>(null)

  // Sync when switching notes
  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setTags(note.tags)
  }, [note.id])

  // Auto-save
  useEffect(() => {
    if (saveTimeout.current) {
      window.clearTimeout(saveTimeout.current)
    }

    saveTimeout.current = window.setTimeout(() => {
      if (
        title !== note.title ||
        content !== note.content ||
        JSON.stringify(tags) !== JSON.stringify(note.tags)
      ) {
        onUpdate(note.id!, { title, content, tags })
      }
    }, 400)

    return () => {
      if (saveTimeout.current) {
        window.clearTimeout(saveTimeout.current)
      }
    }
  }, [title, content, tags, note, onUpdate])

  const html = DOMPurify.sanitize(marked.parse(content || '') as string)

  return (
    <div className="h-full flex flex-col">
      {/* Editor header */}
      <div className="border-b border-surface-800 px-6 py-3 flex items-center justify-between gap-4 shrink-0">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title"
          className="flex-1 bg-transparent text-xl font-semibold text-white placeholder:text-surface-600 focus:outline-none"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(p => !p)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
            title={showPreview ? 'Hide preview' : 'Show preview'}
          >
            {showPreview ? <Edit3 size={16} /> : <Eye size={16} />}
            <span className="hidden sm:inline">{showPreview ? 'Edit only' : 'Preview'}</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Delete this note permanently?')) {
                onDelete(note.id!)
              }
            }}
            className="p-2 rounded-lg text-surface-500 hover:text-red-400 hover:bg-surface-800 transition-colors"
            title="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="px-6 py-2 border-b border-surface-800 shrink-0">
        <TagInput tags={tags} onChange={setTags} />
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden flex">
        {/* Editor */}
        <div className={`${showPreview ? 'w-1/2 border-r border-surface-800' : 'w-full'} flex flex-col`}>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Start writing in Markdown..."
            className="flex-1 w-full bg-transparent px-6 py-4 text-surface-200 placeholder:text-surface-600 resize-none focus:outline-none font-mono text-sm leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-1/2 overflow-y-auto px-6 py-4">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            {!content && (
              <p className="text-surface-600 text-sm">Preview will appear here</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
