# Story 2.6: Suppression de livre avec confirmation

**Status:** done
**Story Points:** 3
**Priority:** P0 - Critique (FR-2.4 - Supprimer un livre)
**Type:** Vertical Slice (UI + Logic + Data)

---

## Story

As a **utilisateur**,
I want **supprimer un livre de ma collection**,
So that **je puisse retirer les livres que je ne possede plus** (FR-2.4).

---

## Vertical Slice Overview

Cette story est une **tranche verticale complete** qui inclut :

| Couche | Composants |
|--------|------------|
| **UI** | AlertDialog de confirmation, actions sur BookCard |
| **Logic** | Confirmation, optimistic UI avec undo |
| **Data** | deleteBook() |
| **Feedback** | Toast avec option Undo |

---

## Acceptance Criteria

### AC1: Declenchement de la suppression

**Given** l'utilisateur clique sur "Supprimer" (via hover ou action visible)
**When** l'action est declenchee
**Then** un AlertDialog s'affiche avec le message "Supprimer ce livre ?"
**And** deux boutons sont presents : "Annuler" et "Supprimer"

### AC2: Annulation de la suppression

**Given** l'utilisateur clique sur "Annuler"
**When** le dialog se ferme
**Then** aucune action n'est effectuee
**And** le livre reste dans la liste

### AC3: Confirmation de la suppression

**Given** l'utilisateur confirme la suppression
**When** il clique sur "Supprimer"
**Then** le livre disparait immediatement de la liste (Optimistic UI)
**And** deleteBook() est appele
**And** un toast "Livre supprime" s'affiche avec option "Annuler" pendant 5 secondes

### AC4: Undo de la suppression

**Given** l'utilisateur clique sur "Annuler" dans le toast
**When** l'action est dans les 5 secondes
**Then** le livre est restaure dans la liste
**And** la suppression cote serveur est annulee (re-creation)

---

## Tasks / Subtasks

- [x] **Task 1: Creer le composant DeleteConfirmDialog** (AC: 1)
  - [x] 1.1 Creer `src/components/book/DeleteConfirmDialog.tsx`
  - [x] 1.2 Utiliser AlertDialog de Shadcn/ui
  - [x] 1.3 Afficher titre du livre a supprimer
  - [x] 1.4 Boutons Annuler et Supprimer

- [x] **Task 2: Implementer handleDeleteBook dans BooksPage** (AC: 3)
  - [x] 2.1 Ajouter state deletingBook et isDeleting
  - [x] 2.2 Implementer ouverture/fermeture du dialog
  - [x] 2.3 Implementer suppression optimistic
  - [x] 2.4 Appeler deleteBook()

- [x] **Task 3: Implementer le toast avec Undo** (AC: 4)
  - [x] 3.1 Afficher toast avec action "Annuler"
  - [x] 3.2 Sauvegarder le livre supprime en memoire (deletedBookRef)
  - [x] 3.3 Implementer la restauration (re-addBook)
  - [x] 3.4 Timeout de 5 secondes

- [x] **Task 4: Tests de verification** (AC: tous)
  - [x] 4.1 Build TypeScript reussi
  - [x] 4.2 Lint des fichiers modifies OK
  - [x] 4.3 Tests manuels a effectuer par l'utilisateur

---

## Dev Notes

### Composant DeleteConfirmDialog

**Fichier : `src/components/book/DeleteConfirmDialog.tsx`**

```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookTitle: string
  onConfirm: () => void
  isDeleting?: boolean
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  bookTitle,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce livre ?</AlertDialogTitle>
          <AlertDialogDescription>
            Voulez-vous vraiment supprimer "{bookTitle}" de votre bibliotheque ?
            Cette action peut etre annulee pendant 5 secondes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

---

### Integration dans BooksPage

**Modifier : `src/pages/BooksPage.tsx` (extrait)**

```typescript
import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { BookPlus, Undo2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getBooks, addBook, updateBook, deleteBook } from '@/lib/books'
import { Button } from '@/components/ui/button'
import { BookList } from '@/components/library/BookList'
import { BookListSkeleton } from '@/components/library/SkeletonCard'
import { EmptyLibrary } from '@/components/library/EmptyLibrary'
import { BookFormDialog } from '@/components/book/BookFormDialog'
import { DeleteConfirmDialog } from '@/components/book/DeleteConfirmDialog'
import type { Book, BookStatus } from '@/types/book'
import type { BookFormData } from '@/schemas/book'

export default function BooksPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingBook, setDeletingBook] = useState<Book | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Ref pour stocker le livre supprime (pour undo)
  const deletedBookRef = useRef<Book | null>(null)
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // ... autres handlers existants ...

  // Handler pour ouvrir le dialog de suppression
  const handleDeleteBook = (id: string) => {
    const book = books.find((b) => b.id === id)
    if (book) {
      setDeletingBook(book)
      setIsDeleteDialogOpen(true)
    }
  }

  // Handler pour confirmer la suppression
  const handleConfirmDelete = async () => {
    if (!deletingBook || !user) return

    setIsDeleting(true)

    // Sauvegarder le livre pour undo potentiel
    deletedBookRef.current = deletingBook

    // Optimistic delete
    setBooks((prev) => prev.filter((book) => book.id !== deletingBook.id))
    setIsDeleteDialogOpen(false)

    // Clear any existing undo timeout
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current)
    }

    try {
      await deleteBook(deletingBook.id)

      // Toast avec option Undo
      toast.success('Livre supprime', {
        duration: 5000,
        action: {
          label: 'Annuler',
          onClick: handleUndoDelete,
        },
      })

      // Timeout pour nettoyer la reference du livre supprime
      undoTimeoutRef.current = setTimeout(() => {
        deletedBookRef.current = null
      }, 5000)

    } catch (error) {
      // Rollback - restaurer le livre
      if (deletedBookRef.current) {
        setBooks((prev) => [deletedBookRef.current!, ...prev])
        deletedBookRef.current = null
      }
      toast.error('Erreur lors de la suppression')
      console.error(error)
    } finally {
      setIsDeleting(false)
      setDeletingBook(null)
    }
  }

  // Handler pour annuler la suppression (Undo)
  const handleUndoDelete = async () => {
    if (!deletedBookRef.current || !user) return

    const bookToRestore = deletedBookRef.current
    deletedBookRef.current = null

    // Clear timeout
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current)
      undoTimeoutRef.current = null
    }

    try {
      // Re-creer le livre dans Supabase
      const restoredBook = await addBook(user.id, {
        title: bookToRestore.title,
        author: bookToRestore.author,
        status: bookToRestore.status,
      })

      // Ajouter le livre restaure a la liste
      setBooks((prev) => [restoredBook, ...prev])
      toast.success('Livre restaure')
    } catch (error) {
      toast.error('Erreur lors de la restauration')
      console.error(error)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="container py-6">
      {/* ... contenu existant ... */}

      {/* ... autres dialogs ... */}

      {/* Dialog de confirmation de suppression */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        bookTitle={deletingBook?.title ?? ''}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
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
| `src/components/book/DeleteConfirmDialog.tsx` | Creer | Dialog de confirmation |
| `src/pages/BooksPage.tsx` | Modifier | Ajouter logic suppression + undo |

### Shadcn/ui Composants requis

```bash
npx shadcn@latest add alert-dialog
```

---

## UX Requirements

[Source: docs/ux-design-specification.md#Interaction Patterns]

### Flow de suppression

```
1. Clic sur "Supprimer"
2. AlertDialog : "Supprimer ce livre ?"
3. Confirm ou Cancel
4. Si confirm : Suppression optimistic
5. Toast avec Undo (5 secondes)
6. Si Undo : Livre restaure
```

### AlertDialog Design

- Titre : "Supprimer ce livre ?"
- Description : Inclut le titre du livre
- Bouton Cancel : Style outline
- Bouton Confirm : Style destructive (rouge)
- Duree toast : 5 secondes avec action

---

## Architecture Compliance Checklist

- [x] DeleteConfirmDialog dans `src/components/book/`
- [x] AlertDialog Shadcn/ui utilise
- [x] Optimistic UI pour suppression
- [x] Toast avec action Undo
- [x] Timeout de 5 secondes pour Undo
- [x] Re-creation du livre si Undo
- [x] Cleanup des timeouts on unmount

---

## Dependencies

### Story Dependencies

| Dependance | Type | Statut |
|------------|------|--------|
| Story 2.1 | Bloquante | ready-for-dev |
| Story 2.3 | Bloquante | ready-for-dev |

### Technical Dependencies

| Package | Usage |
|---------|-------|
| sonner | Toast avec action |

---

## Testing Requirements

### Tests manuels

1. **Dialog de confirmation** :
   - Cliquer Supprimer → dialog apparait
   - Titre du livre affiche

2. **Annulation** :
   - Cliquer Annuler → dialog ferme, livre reste

3. **Suppression confirmee** :
   - Cliquer Supprimer → livre disparait
   - Toast avec "Annuler" visible

4. **Undo reussi** :
   - Dans les 5 secondes, cliquer "Annuler"
   - Livre reapparait dans la liste

5. **Undo expire** :
   - Attendre plus de 5 secondes
   - Le toast disparait
   - Le livre reste supprime

---

## Security Considerations

- Suppression protegee par RLS Supabase
- Seul le proprietaire peut supprimer ses livres
- L'undo re-cree un nouveau livre (nouvel id)

---

## References

- [Source: docs/architecture.md#Frontend Architecture]
- [Source: docs/ux-design-specification.md#User Journey Flows]
- [Source: docs/ux-design-specification.md#Feedback Patterns]
- [Source: docs/epics.md#Story 2.6]
- [Source: CLAUDE.md#Toast Messages]

---

## Dev Agent Record

### Context Reference

Story context generated by SM agent (Bob) on 2025-12-18.
Vertical slice approach: UI + Logic + Data integration.
Cette story implemente FR-2.4 (Supprimer un livre).

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes List

- Implemente le 2025-12-19 par Dev Agent (Amelia)
- AlertDialog de Shadcn/ui installe via `npx shadcn@latest add alert-dialog`
- DeleteConfirmDialog cree avec props: open, onOpenChange, bookTitle, onConfirm, isDeleting
- Logique de suppression avec Optimistic UI implementee dans BooksPage
- Toast avec action Undo (5 secondes) utilisant sonner
- Refs useRef pour stocker le livre supprime et gerer le timeout
- Cleanup des timeouts on unmount via useEffect
- Build TypeScript OK, lint OK sur fichiers modifies
- Tests manuels requis pour validation complete

### File List

| Fichier | Action | Description |
|---------|--------|-------------|
| `ma-bibliotheque/src/components/ui/alert-dialog.tsx` | Cree | Composant Shadcn/ui AlertDialog |
| `ma-bibliotheque/src/components/book/DeleteConfirmDialog.tsx` | Cree | Dialog de confirmation de suppression |
| `ma-bibliotheque/src/pages/BooksPage.tsx` | Modifie | Ajout logique suppression + undo |

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
- [x] Security considerations documentees
- [x] References aux documents sources
- [x] Testing requirements definis

**Status: READY FOR DEVELOPMENT**
