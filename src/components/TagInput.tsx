import { useState, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'

interface Props {
  tags: string[]
  onChange: (tags: string[]) => void
}

export default function TagInput({ tags, onChange }: Props) {
  const [input, setInput] = useState('')

  const addTag = (value: string) => {
    const tag = value.trim().toLowerCase()
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag])
    }
    setInput('')
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter(t => t !== tag))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-600/20 text-sky-300 text-xs"
        >
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className="hover:text-white transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length === 0 ? 'Add tags...' : ''}
        className="bg-transparent text-sm text-surface-300 placeholder:text-surface-600 focus:outline-none min-w-[80px] flex-1"
      />
    </div>
  )
}
