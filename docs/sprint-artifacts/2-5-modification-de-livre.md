# Story 2.5: Modification de livre

**Status:** ready-for-dev
**Story Points:** 3
**Priority:** P0 - Critique (FR-2.3 - Modifier un livre)
**Type:** Vertical Slice (UI + Logic + Data)

---

## Story

As a **utilisateur**,
I want **modifier les informations d'un livre existant**,
So that **je puisse corriger des erreurs ou mettre a jour les donnees** (FR-2.3).

---

## Vertical Slice Overview

Cette story est une **tranche verticale complete** qui inclut :

| Couche | Composants |
|--------|------------|
| **UI** | BookForm en mode edit, actions sur BookCard |
| **Logic** | Pre-remplissage formulaire, optimistic UI |
| **Data** | updateBook() |
| **Feedback** | Toast "Livre modifie" |

---

## Acceptance Criteria

### AC1: Actions de modification visibles (desktop)

**Given** un BookCard affiche (desktop)
**When** l'utilisateur survole la carte
**Then** les actions Editer et Supprimer apparaissent

### AC2: Actions de modification visibles (mobile)

**Given** un BookCard affiche (mobile)
**When** l'utilisateur visualise la carte
**Then** les actions Editer et Supprimer sont toujours visibles
*(Note: Swipe actions seront ajoutees en amelioration post-MVP)*

### AC3: Ouverture du formulaire d'edition

**Given** l'utilisateur clique sur "Editer"
**When** le formulaire s'ouvre
**Then** BookForm est en mode edition
**And** les champs sont pre-remplis avec les donnees actuelles du livre
**And** le bouton submit affiche "Sauvegarder"

### AC4: Modification reussie

**Given** le formulaire d'edition soumis avec des modifications
**When** la soumission reussit
**Then** updateBook() est appele avec les nouvelles donnees
**And** le BookCard se met a jour immediatement (Optimistic UI)
**And** le formulaire se ferme
**And** un toast "Livre modifie" s'affiche

### AC5: Validation des modifications

**Given** le formulaire d'edition avec des donnees invalides
**When** l'utilisateur soumet
**Then** les erreurs de validation s'affichent inline
**And** le formulaire n'est pas soumis

---

## Tasks / Subtasks

- [ ] **Task 1: Ajouter l'etat d'edition dans BooksPage** (AC: 3)
  - [ ] 1.1 Ajouter state editingBook: Book | null
  - [ ] 1.2 Ajouter state isEditDialogOpen
  - [ ] 1.3 Implementer handleEditBook pour ouvrir le dialog

- [ ] **Task 2: Adapter BookFormDialog pour edition** (AC: 3)
  - [ ] 2.1 Passer le livre a editer en prop
  - [ ] 2.2 Gerer le mode edit dans BookFormDialog
  - [ ] 2.3 Pre-remplir le formulaire avec initialData

- [ ] **Task 3: Implementer handleUpdateBook** (AC: 4)
  - [ ] 3.1 Implementer optimistic UI pour update
  - [ ] 3.2 Appeler updateBook() avec les nouvelles donnees
  - [ ] 3.3 Fermer le dialog apres succes
  - [ ] 3.4 Afficher toast "Livre modifie"

- [ ] **Task 4: Tests de verification** (AC: tous)
  - [ ] 4.1 Tester clic Editer → formulaire pre-rempli
  - [ ] 4.2 Tester modification → carte mise a jour
  - [ ] 4.3 Tester validation erreurs
  - [ ] 4.4 Tester toast de confirmation

---

## Dev Notes

### Integration dans BooksPage

**Modifier : `src/pages/BooksPage.tsx` (extrait)**

```typescript
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { BookPlus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getBooks, addBook, updateBook } from '@/lib/books'
import { Button } from '@/components/ui/button'
import { BookList } from '@/components/library/BookList'
import { BookListSkeleton } from '@/components/library/SkeletonCard'
import { EmptyLibrary } from '@/components/library/EmptyLibrary'
import { BookFormDialog } from '@/components/book/BookFormDialog'
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

  // ... fetchBooks et handleAddBook existants ...

  // Handler pour ouvrir le dialog d'edition
  const handleEditBook = (book: Book) => {
    setEditingBook(book)
    setIsEditDialogOpen(true)
  }

  // Handler pour la modification de livre
  const handleUpdateBook = async (data: BookFormData) => {
    if (!editingBook) return

    setIsSubmitting(true)

    // Sauvegarder l'etat precedent pour rollback
    const previousBooks = [...books]

    // Optimistic update
    setBooks((prev) =>
      prev.map((book) =>
        book.id === editingBook.id
          ? { ...book, ...data, updated_at: new Date().toISOString() }
          : book
      )
    )
    setIsEditDialogOpen(false)
    setEditingBook(null)

    try {
      await updateBook(editingBook.id, data)
      toast.success('Livre modifie')
    } catch (error) {
      // Rollback
      setBooks(previousBooks)
      toast.error('Erreur lors de la modification')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler pour fermer le dialog d'edition
  const handleCloseEditDialog = (open: boolean) => {
    setIsEditDialogOpen(open)
    if (!open) {
      setEditingBook(null)
    }
  }

  return (
    <div className="container py-6">
      {/* ... header existant ... */}

      {/* Contenu principal */}
      {isLoading ? (
        <BookListSkeleton />
      ) : error ? (
        // ... error state ...
      ) : books.length === 0 ? (
        <EmptyLibrary onAddBook={() => setIsAddDialogOpen(true)} />
      ) : (
        <BookList
          books={books}
          onEditBook={handleEditBook}
          onDeleteBook={handleDeleteBook}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* ... FAB existant ... */}

      {/* Dialog pour ajout */}
      <BookFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mode="create"
        onSubmit={handleAddBook}
        isSubmitting={isSubmitting}
      />

      {/* Dialog pour edition */}
      <BookFormDialog
        open={isEditDialogOpen}
        onOpenChange={handleCloseEditDialog}
        mode="edit"
        book={editingBook || undefined}
        onSubmit={handleUpdateBook}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
```

---

### Rappel BookFormDialog

Le composant BookFormDialog cree dans Story 2.4 gere deja :
- Le mode `edit` avec pre-remplissage via `book` prop
- Le titre "Modifier le livre" en mode edit
- Le bouton "Sauvegarder" en mode edit

Pas de modification necessaire sur BookFormDialog.

---

### Rappel BookCard

Le composant BookCard cree dans Story 2.3 inclut deja :
- Le bouton "Editer" avec handler `onEdit`
- Visibilite au hover sur desktop
- Visibilite permanente sur mobile

Pas de modification necessaire sur BookCard.

---

## Project Structure Notes

### Fichiers modifies

| Fichier | Action | Description |
|---------|--------|-------------|
| `src/pages/BooksPage.tsx` | Modifier | Ajouter logic d'edition |

### Aucun nouveau fichier

Cette story reutilise les composants existants :
- `BookFormDialog` (Story 2.4)
- `BookCard` (Story 2.3)
- `updateBook()` (Story 2.1)

---

## UX Requirements

[Source: docs/ux-design-specification.md#Interaction Patterns]

### Flow d'edition

```
1. Clic sur "Editer" (hover desktop / toujours visible mobile)
2. Dialog/Sheet s'ouvre avec donnees pre-remplies
3. Modification des champs souhaites
4. Clic "Sauvegarder"
5. Update immediat (Optimistic UI)
6. Toast "Livre modifie"
7. Dialog ferme automatiquement
```

### Validation

Memes regles que pour l'ajout :
- Titre : Required, 1-200 caracteres
- Auteur : Required, 1-100 caracteres
- Statut : Enum

---

## Architecture Compliance Checklist

- [ ] Reutilisation de BookFormDialog existant
- [ ] Optimistic UI pour update
- [ ] Rollback en cas d'erreur
- [ ] Toast "Livre modifie" en francais
- [ ] Auto-close du dialog apres succes
- [ ] State editingBook pour suivre le livre edite

---

## Dependencies

### Story Dependencies

| Dependance | Type | Statut |
|------------|------|--------|
| Story 2.1 | Bloquante | ready-for-dev |
| Story 2.3 | Bloquante | ready-for-dev |
| Story 2.4 | Bloquante | ready-for-dev |

### Technical Dependencies

Aucune nouvelle - reutilise les packages existants.

---

## Testing Requirements

### Tests manuels

1. **Ouverture dialog edition** :
   - Cliquer Editer sur un livre
   - Dialog s'ouvre avec donnees pre-remplies

2. **Modification reussie** :
   - Modifier le titre et/ou auteur
   - Sauvegarder → carte mise a jour immediatement
   - Toast "Livre modifie" apparait

3. **Annulation** :
   - Ouvrir dialog edition
   - Cliquer Annuler → aucune modification

4. **Validation** :
   - Vider le champ titre → erreur inline
   - Corriger → erreur disparait

5. **Optimistic UI rollback** :
   - Avec Network offline
   - Modifier → erreur → retour aux donnees originales

---

## Security Considerations

- Les modifications sont protegees par RLS Supabase
- Seul le proprietaire du livre peut le modifier
- Validation Zod cote client avant envoi

---

## References

- [Source: docs/architecture.md#Frontend Architecture]
- [Source: docs/ux-design-specification.md#User Journey Flows]
- [Source: docs/ux-design-specification.md#Interaction Patterns]
- [Source: docs/epics.md#Story 2.5]
- [Source: CLAUDE.md#Toast Messages]

---

## Dev Agent Record

### Context Reference

Story context generated by SM agent (Bob) on 2025-12-18.
Vertical slice approach: Reutilise composants existants.
Cette story implemente FR-2.3 (Modifier un livre).

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
- [x] Security considerations documentees
- [x] References aux documents sources
- [x] Testing requirements definis

**Status: READY FOR DEVELOPMENT**
