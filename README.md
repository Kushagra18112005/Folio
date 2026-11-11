# Folio

Local-first markdown notes. Everything stays in your browser.

I built this because I wanted a simple place to write that didn’t require an account, didn’t send my notes anywhere, and still felt modern. No sync servers, no login walls — just open the app and start writing.

## Features

- **Fully local** — Notes are stored in IndexedDB. Nothing leaves your machine.
- Markdown editor with live preview
- Tags + filtering
- Full-text search across titles and content
- Auto-save (debounced)
- Dark mode (default) with light mode toggle
- Export all notes as JSON
- Clean, distraction-free interface

## Tech

- React + TypeScript + Vite
- Tailwind CSS
- Dexie (IndexedDB wrapper)
- marked + DOMPurify for safe Markdown rendering
- date-fns for relative timestamps
- Lucide icons

## Running locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/     # Sidebar, Editor, TagInput
  db.ts           # Dexie database setup
  types.ts        # Shared types
  App.tsx         # Main layout and state
  main.tsx
  index.css       # Tailwind + prose styles
```

## Why local-first?

I got tired of notes apps that force you to create an account just to write a few sentences. Folio keeps the data on the device. If you want backups, use the export button. If you want sync later, the storage layer is isolated enough that it can be swapped.

## License

MIT
