# Story 2.4: Ajout de livre avec formulaire

**Status:** ready-for-dev
**Story Points:** 5
**Priority:** P0 - Critique (FR-2.2 - Ajouter un livre)
**Type:** Vertical Slice (UI + Logic + Data)

---

## Story

As a **utilisateur**,
I want **ajouter un nouveau livre a ma collection**,
So that **je puisse cataloguer mes achats** (FR-2.2).

---

## Vertical Slice Overview

Cette story est une **tranche verticale complete** qui inclut :

| Couche | Composants |
|--------|------------|
| **UI** | BookForm, Dialog (desktop), Sheet (mobile), FAB |
| **Logic** | Validation Zod, gestion formulaire React Hook Form |
| **Data** | addBook() |
| **Feedback** | Toast succes, validation inline |

---

## Acceptance Criteria

### AC1: Ouverture du formulaire (mobile)

**Given** l'utilisateur sur la page bibliotheque (mobile)
**When** il clique sur le FAB (+)
**Then** un Sheet slide-up s'ouvre avec le formulaire BookForm

### AC2: Ouverture du formulaire (desktop)

**Given** l'utilisateur sur la page bibliotheque (desktop)
**When** il clique sur le bouton "Ajouter un livre" dans le header
**Then** un Dialog modal s'ouvre avec le formulaire BookForm

### AC3: Formulaire en mode creation

**Given** le formulaire BookForm en mode creation
**When** il s'affiche
**Then** les champs Titre, Auteur sont vides
**And** le statut est pre-selectionne sur "A lire"
**And** le bouton submit affiche "Ajouter"

### AC4: Soumission avec donnees valides

**Given** le formulaire rempli avec des donnees valides
**When** l'utilisateur soumet
**Then** addBook() est appele avec les donnees
**And** le nouveau livre apparait immediatement dans la liste (Optimistic UI)
**And** le formulaire se ferme automatiquement
**And** un toast "Livre ajoute" s'affiche

### AC5: Validation des erreurs

**Given** le formulaire avec champs vides ou invalides
**When** l'utilisateur tente de soumettre
**Then** les erreurs s'affichent inline sous chaque champ concerne
**And** le formulaire n'est pas soumis

---

## Tasks / Subtasks

- [ ] **Task 1: Creer le composant BookForm** (AC: 3, 5)
  - [ ] 1.1 Creer `src/components/book/BookForm.tsx`
  - [ ] 1.2 Integrer React Hook Form avec Zod resolver
  - [ ] 1.3 Ajouter les champs Titre, Auteur, Statut
  - [ ] 1.4 Implementer la validation inline
  - [ ] 1.5 Gerer le mode create vs edit (props)

- [ ] **Task 2: Creer le wrapper responsive** (AC: 1, 2)
  - [ ] 2.1 Creer `src/components/book/BookFormDialog.tsx`
  - [ ] 2.2 Utiliser Sheet pour mobile (< 640px)
  - [ ] 2.3 Utiliser Dialog pour desktop (>= 640px)
  - [ ] 2.4 Gerer l'ouverture/fermeture via props

- [ ] **Task 3: Integrer dans BooksPage** (AC: 4)
  - [ ] 3.1 Ajouter l'etat isAddDialogOpen
  - [ ] 3.2 Connecter le FAB et le bouton header
  - [ ] 3.3 Implementer handleAddBook avec optimistic UI
  - [ ] 3.4 Fermer le dialog apres succes

- [ ] **Task 4: Tests de verification** (AC: tous)
  - [ ] 4.1 Tester ouverture Sheet sur mobile
  - [ ] 4.2 Tester ouverture Dialog sur desktop
  - [ ] 4.3 Tester validation des champs
  - [ ] 4.4 Tester ajout reussi avec toast

---

## Dev Notes

### Composant BookForm

**Fichier : `src/components/book/BookForm.tsx`**

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { bookFormSchema, defaultBookValues, type BookFormData } from '@/schemas/book'
import type { Book } from '@/types/book'

interface BookFormProps {
  mode: 'create' | 'edit'
  initialData?: Book
  onSubmit: (data: BookFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function BookForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: BookFormProps) {
  const form = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          author: initialData.author,
          status: initialData.status,
        }
      : defaultBookValues,
  })

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champ Titre */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Le Petit Prince"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ Auteur */}
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Auteur *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Antoine de Saint-Exupery"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ Statut */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="to_read">A lire</SelectItem>
                  <SelectItem value="reading">En cours</SelectItem>
                  <SelectItem value="read">Lu</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'En cours...' : mode === 'create' ? 'Ajouter' : 'Sauvegarder'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

---

### Wrapper Responsive Dialog/Sheet

**Fichier : `src/components/book/BookFormDialog.tsx`**

```typescript
import { useMediaQuery } from '@/hooks/useMediaQuery'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { BookForm } from './BookForm'
import type { Book } from '@/types/book'
import type { BookFormData } from '@/schemas/book'

interface BookFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  book?: Book
  onSubmit: (data: BookFormData) => void
  isSubmitting?: boolean
}

export function BookFormDialog({
  open,
  onOpenChange,
  mode,
  book,
  onSubmit,
  isSubmitting,
}: BookFormDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const title = mode === 'create' ? 'Ajouter un livre' : 'Modifier le livre'

  const handleCancel = () => {
    onOpenChange(false)
  }

  const formContent = (
    <BookForm
      mode={mode}
      initialData={book}
      onSubmit={onSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  )

  // Desktop : Dialog modal
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    )
  }

  // Mobile : Sheet slide-up
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[90vh]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="mt-4">{formContent}</div>
      </SheetContent>
    </Sheet>
  )
}
```

---

### Hook useMediaQuery

**Fichier : `src/hooks/useMediaQuery.ts`**

```typescript
import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // Set initial value
    setMatches(media.matches)

    // Listen for changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}
```

---

### Integration dans BooksPage

**Modifier : `src/pages/BooksPage.tsx` (extrait)**

```typescript
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { BookPlus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getBooks, addBook } from '@/lib/books'
import { Button } from '@/components/ui/button'
import { BookList } from '@/components/library/BookList'
import { BookListSkeleton } from '@/components/library/SkeletonCard'
import { EmptyLibrary } from '@/components/library/EmptyLibrary'
import { BookFormDialog } from '@/components/book/BookFormDialog'
import type { Book } from '@/types/book'
import type { BookFormData } from '@/schemas/book'

export default function BooksPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ... fetchBooks reste inchange ...

  // Handler pour l'ajout de livre
  const handleAddBook = async (data: BookFormData) => {
    if (!user) return

    setIsSubmitting(true)

    // Generer un ID temporaire pour optimistic UI
    const tempId = `temp-${Date.now()}`
    const optimisticBook: Book = {
      id: tempId,
      user_id: user.id,
      title: data.title,
      author: data.author,
      status: data.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Optimistic update
    setBooks((prev) => [optimisticBook, ...prev])
    setIsAddDialogOpen(false)

    try {
      const newBook = await addBook(user.id, data)
      // Remplacer le livre temporaire par le vrai
      setBooks((prev) =>
        prev.map((book) => (book.id === tempId ? newBook : book))
      )
      toast.success('Livre ajoute')
    } catch (error) {
      // Rollback
      setBooks((prev) => prev.filter((book) => book.id !== tempId))
      toast.error("Erreur lors de l'ajout")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ma Bibliotheque</h1>
          <p className="text-muted-foreground">
            {books.length} livre{books.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Bouton ajouter - desktop uniquement */}
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="hidden sm:flex"
        >
          <BookPlus className="mr-2 h-4 w-4" />
          Ajouter un livre
        </Button>
      </div>

      {/* Contenu principal */}
      {/* ... code existant ... */}

      {/* FAB Mobile */}
      {!isLoading && (
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg sm:hidden"
          aria-label="Ajouter un livre"
        >
          <BookPlus className="h-6 w-6" />
        </Button>
      )}

      {/* Dialog/Sheet pour ajout */}
      <BookFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mode="create"
        onSubmit={handleAddBook}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
```

---

## Project Structure Notes

### Fichiers crees/modifies

| Fichier | Action | Description |
|---------|--------|-------------|
| `src/components/book/BookForm.tsx` | Creer | Formulaire avec React Hook Form + Zod |
| `src/components/book/BookFormDialog.tsx` | Creer | Wrapper responsive Dialog/Sheet |
| `src/hooks/useMediaQuery.ts` | Creer | Hook pour detection responsive |
| `src/pages/BooksPage.tsx` | Modifier | Integration dialog et handler |

### Shadcn/ui Composants requis

```bash
npx shadcn@latest add dialog sheet select form input label
```

### Packages NPM requis

```bash
npm install @hookform/resolvers react-hook-form
```

---

## UX Requirements

[Source: docs/ux-design-specification.md#BookForm]

### Formulaire Anatomy

```
┌─────────────────────────────────────┐
│  Ajouter un livre          [×]     │  ← Header
├─────────────────────────────────────┤
│                                     │
│  Titre *                            │
│  ┌─────────────────────────────┐    │
│  │ Ex: Le Petit Prince         │    │  ← Input required
│  └─────────────────────────────┘    │
│                                     │
│  Auteur *                           │
│  ┌─────────────────────────────┐    │
│  │ Ex: Antoine de Saint-Exupery│    │  ← Input required
│  └─────────────────────────────┘    │
│                                     │
│  Statut                             │
│  ┌─────────────────────────────┐    │
│  │ A lire              ▼       │    │  ← Select default
│  └─────────────────────────────┘    │
│                                     │
│  [Annuler]        [Ajouter]         │  ← Actions
│                                     │
└─────────────────────────────────────┘
```

### Validation Rules

- Titre : Required, 1-200 caracteres
- Auteur : Required, 1-100 caracteres
- Statut : Enum, default "to_read"

### Responsive Behavior

| Breakpoint | Composant | Animation |
|------------|-----------|-----------|
| < 640px | Sheet | Slide-up from bottom |
| >= 640px | Dialog | Fade + Scale centered |

---

## Architecture Compliance Checklist

- [ ] BookForm dans `src/components/book/`
- [ ] BookFormDialog dans `src/components/book/`
- [ ] useMediaQuery dans `src/hooks/`
- [ ] React Hook Form + Zod integration
- [ ] Optimistic UI pour l'ajout
- [ ] Toast "Livre ajoute" apres succes
- [ ] Auto-close du dialog apres succes
- [ ] FAB visible mobile uniquement
- [ ] Dialog desktop, Sheet mobile

---

## Dependencies

### Story Dependencies

| Dependance | Type | Statut |
|------------|------|--------|
| Story 2.1 | Bloquante | ready-for-dev |
| Story 2.2 | Bloquante | ready-for-dev |

### Technical Dependencies

| Package | Version | Usage |
|---------|---------|-------|
| react-hook-form | ^7.x | Form management |
| @hookform/resolvers | ^3.x | Zod integration |
| zod | ^3.x | Validation |

---

## Testing Requirements

### Tests manuels

1. **Ouverture responsive** :
   - Mobile (< 640px) : FAB → Sheet slide-up
   - Desktop (>= 640px) : Button header → Dialog modal

2. **Validation** :
   - Soumettre avec titre vide → erreur inline
   - Soumettre avec auteur vide → erreur inline
   - Corriger → erreur disparait

3. **Ajout reussi** :
   - Remplir et soumettre → nouveau livre dans la liste
   - Dialog se ferme automatiquement
   - Toast "Livre ajoute" apparait

4. **Optimistic UI** :
   - Avec Network Slow 3G
   - Livre apparait immediatement
   - Si erreur → livre disparait

---

## Accessibility Considerations

### Formulaire

- Labels associes aux inputs
- Messages d'erreur lies aux champs (aria-describedby)
- Focus trap dans Dialog/Sheet
- Escape ferme le dialog

### FAB Mobile

- `aria-label="Ajouter un livre"`
- Touch target 56x56px (> 44px minimum)

---

## References

- [Source: docs/architecture.md#Frontend Architecture]
- [Source: docs/ux-design-specification.md#BookForm]
- [Source: docs/ux-design-specification.md#Modal Patterns]
- [Source: docs/ux-design-specification.md#Form Patterns]
- [Source: docs/epics.md#Story 2.4]
- [Source: CLAUDE.md#Toast Messages]

---

## Dev Agent Record

### Context Reference

Story context generated by SM agent (Bob) on 2025-12-18.
Vertical slice approach: UI + Logic + Data integration.
Cette story implemente FR-2.2 (Ajouter un livre).

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes List

_A remplir par le Dev agent apres implementation_

### File List

_A remplir par le Dev agent apres implementation_

---

## Story Ready Checklist

- [x] User story statement complete
- [x] Acceptance criteria detailles avec Given/When/Then
- [x] Vertical slice coverage (UI + Logic + Data)
- [x] Tasks decomposees en subtasks actionnables
- [x] Dev notes avec code complet et fonctionnel
- [x] Architecture compliance verifiee
- [x] Dependencies identifiees
- [x] UX requirements documentes
- [x] Accessibility considerations documentees
- [x] References aux documents sources
- [x] Testing requirements definis

**Status: READY FOR DEVELOPMENT**
