---
project_name: 'Ma Bibliotheque'
user_name: 'MiKL'
date: '2025-12-17'
sections_completed: ['technology_stack', 'critical_rules', 'patterns', 'anti_patterns']
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI framework |
| Vite | 6.x | Build tool |
| TypeScript | 5.x strict | Type safety |
| Tailwind CSS | v4 | Styling (via @tailwindcss/vite) |
| Shadcn/ui | latest | UI components |
| React Router | 7.x | Client-side routing |
| React Hook Form | latest | Form handling |
| Zod | latest | Schema validation |
| Supabase | @supabase/supabase-js | Auth + Database |

**Deployment:** Vercel (auto-deploy from main branch)

---

## Critical Implementation Rules

### 1. Supabase Constraints (CRITICAL)

```
❌ NO Edge Functions - All logic must be client-side
❌ NO Storage - No image uploads
❌ NO Realtime - No subscriptions, manual refresh only
```

### 2. Type Definitions Must Match Supabase

```typescript
// CORRECT - Use snake_case to match database columns
interface Book {
  id: string
  user_id: string      // NOT userId
  title: string
  author: string
  status: 'to_read' | 'reading' | 'read'
  created_at: string   // NOT createdAt
  updated_at: string
}
```

### 3. Service Layer Pattern (MANDATORY)

All Supabase calls MUST go through service functions in `lib/`:

```typescript
// lib/books.ts - CORRECT
export async function getBooks(userId: string): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data ?? []
}

// Component - WRONG: Direct Supabase call
const { data } = await supabase.from('books').select('*') // ❌ NEVER DO THIS
```

### 4. Error Handling Pattern (MANDATORY)

```typescript
// ALWAYS use this pattern
try {
  await serviceFunction(data)
  toast.success("Livre ajouté")  // French messages
} catch (error) {
  toast.error("Erreur lors de l'ajout")
  console.error(error)  // Always log for debugging
}
```

### 5. Loading State Pattern

```typescript
const [isLoading, setIsLoading] = useState(false)

async function handleAction() {
  setIsLoading(true)
  try {
    await action()
  } finally {
    setIsLoading(false)  // ALWAYS in finally block
  }
}
```

---

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `BookCard.tsx` |
| Component files | PascalCase.tsx | `StatusBadge.tsx` |
| Utility files | kebab-case.ts | `supabase.ts` |
| Functions | camelCase | `getBooks`, `handleSubmit` |
| Variables | camelCase | `userId`, `bookList` |
| Constants | UPPER_SNAKE_CASE | `MAX_BOOKS` |
| Types/Interfaces | PascalCase | `Book`, `BookFormData` |
| DB columns | snake_case | `user_id`, `created_at` |

---

## File Organization

```
src/
├── components/
│   ├── ui/           # Shadcn/ui ONLY - DO NOT MODIFY
│   ├── book/         # Book domain components
│   ├── library/      # Library page components
│   └── layout/       # Layout components
├── contexts/         # React contexts (AuthContext)
├── hooks/            # Custom hooks
├── lib/              # Supabase client + service functions
├── pages/            # Page components
├── schemas/          # Zod validation schemas
└── types/            # TypeScript interfaces
```

**Rules:**
- ONE component per file
- Tests co-located: `ComponentName.test.tsx`
- Never put business logic in `components/ui/`

---

## UI/UX Patterns

### Toast Messages (French)

| Action | Success | Error |
|--------|---------|-------|
| Add | "Livre ajouté" | "Erreur lors de l'ajout" |
| Update | "Livre modifié" | "Erreur lors de la modification" |
| Delete | "Livre supprimé" | "Erreur lors de la suppression" |
| Network | - | "Connexion impossible" |

### Responsive Modals

```typescript
// Mobile (< 640px): Use Sheet (slide-up)
// Desktop (>= 640px): Use Dialog (centered modal)
```

### Optimistic UI for Status Changes

```typescript
// 1. Update local state immediately
setBooks(prev => prev.map(b => b.id === id ? {...b, status} : b))
// 2. Then sync with server
await updateBookStatus(id, status)
// 3. Rollback on error if needed
```

---

## Authentication Pattern

```typescript
// AuthContext provides:
const { user, signIn, signUp, signOut, isLoading } = useAuth()

// Protected routes use:
<ProtectedRoute>
  <BooksPage />
</ProtectedRoute>
```

**Auth Flow:**
1. Check session on app load
2. Redirect to `/login` if no session
3. Redirect to `/books` after successful login

---

## Zod Schema Pattern

```typescript
// schemas/book.ts
import { z } from 'zod'

export const bookSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(200),
  author: z.string().min(1, "L'auteur est requis").max(100),
  status: z.enum(["to_read", "reading", "read"]).default("to_read"),
})

export type BookFormData = z.infer<typeof bookSchema>
```

---

## Anti-Patterns (NEVER DO)

```typescript
// ❌ Direct Supabase calls in components
const { data } = await supabase.from('books').select('*')

// ❌ camelCase for database types
interface Book { userId: string }  // WRONG

// ❌ Silent error swallowing
try { await action() } catch {} // WRONG - always handle errors

// ❌ Multiple components in one file
export function BookCard() {}
export function BookList() {}  // WRONG - separate files

// ❌ Modifying files in components/ui/
// These are Shadcn/ui generated - create wrappers instead

// ❌ English toast messages
toast.success("Book added")  // WRONG - use French
```

---

## Path Aliases

```typescript
// Use @ alias for src/ imports
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { getBooks } from '@/lib/books'
```

---

## Environment Variables

```bash
# Required in .env.local (gitignored)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Template in .env.example (committed)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

**Access in code:**
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
```

---

## Quick Reference

**Before implementing any feature, verify:**
- [ ] Using service layer for Supabase calls
- [ ] Types match database snake_case columns
- [ ] Error handling with try/catch + toast
- [ ] French messages for user-facing text
- [ ] One component per file
- [ ] Tests co-located with component
