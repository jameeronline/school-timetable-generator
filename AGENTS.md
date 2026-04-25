# AGENTS.md

## Dev Commands
- `npm run dev` - Start dev server
- `npm run build` - Typecheck then Vite build (`tsc -b && vite build`)
- `npm run lint` - ESLint
- `npm run preview` - Preview production build

**Important**: Build runs `tsc -b` (typecheck) before `vite build` - fixes type errors first.

## Architecture
- **Stack**: React 19, TypeScript ~6.0, Vite 8, Tailwind CSS v4, Zustand
- **Router**: react-router-dom (SPA)
- **State**: Zustand with persist middleware (localStorage)
- **Pages**: `/` (Home), `/saved` (SavedTimetables)
- **Entry**: `src/main.tsx` → `src/App.tsx`

## Path Alias
`@/*` maps to `./src/*` (configured in both vite.config.ts and tsconfig.json)

## Notes
- No test framework configured
- Uses Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Uses shadcn-style UI components in `src/components/ui/`
- Common subjects predefined in `src/types.ts` (COMMON_SUBJECTS)