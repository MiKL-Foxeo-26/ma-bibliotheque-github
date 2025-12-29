# Story 2.7: Filtrage par statut

**Status:** done
**Story Points:** 3
**Priority:** P0 - Critique (FR-2.5 - Filtrer les livres)
**Type:** Vertical Slice (UI + Logic)

---

## Story

As a **utilisateur**,
I want **filtrer mes livres par statut de lecture**,
So that **je trouve rapidement les livres d'une categorie** (FR-2.5).

---

## Vertical Slice Overview

Cette story est une **tranche verticale** qui inclut :

| Couche | Composants |
|--------|------------|
| **UI** | StatusFilter (Toggle Group) |
| **Logic** | Filtrage cote client, compteurs dynamiques |
| **Data** | Aucune requete serveur (filtrage local) |
| **Feedback** | Message si filtre vide |

---

## Acceptance Criteria

### AC1: Affichage du StatusFilter

**Given** le composant StatusFilter affiche
**When** il se rend
**Then** un Toggle Group affiche : "Tous", "A lire", "En cours", "Lu"
**And** chaque option affiche le compteur de livres correspondant
**And** "Tous" est selectionne par defaut

### AC2: Filtrage par statut

**Given** l'utilisateur clique sur "A lire"
**When** le filtre est applique
**Then** seuls les livres avec status "to_read" sont affiches
**And** le filtrage est instantane (cote client, pas de requete serveur)
**And** le compteur total se met a jour

### AC3: Filtre sans resultat

**Given** un filtre actif sans resultat
**When** aucun livre ne correspond
**Then** un message "Aucun livre [statut]" s'affiche
**And** un lien "Voir tous les livres" permet de reinitialiser le filtre

### AC4: Mise a jour des compteurs

**Given** l'utilisateur ajoute/modifie/supprime un livre
**When** la liste change
**Then** les compteurs du StatusFilter sont recalcules automatiquement
**And** le filtre actif reste applique

---

## Tasks / Subtasks

- [x] **Task 1: Creer le composant StatusFilter** (AC: 1)
  - [x] 1.1 Creer `src/components/library/StatusFilter.tsx`
  - [x] 1.2 Utiliser ToggleGroup de Shadcn/ui
  - [x] 1.3 Afficher les 4 options avec compteurs
  - [x] 1.4 Gerer la selection via onChange

- [x] **Task 2: Creer le composant FilteredEmptyState** (AC: 3)
  - [x] 2.1 Creer message pour filtre vide
  - [x] 2.2 Ajouter lien "Voir tous les livres"

- [x] **Task 3: Integrer dans BooksPage** (AC: 2, 4)
  - [x] 3.1 Ajouter state filterStatus
  - [x] 3.2 Calculer filteredBooks avec useMemo
  - [x] 3.3 Calculer counts avec useMemo
  - [x] 3.4 Integrer StatusFilter dans le layout
  - [x] 3.5 Gerer l'affichage filtre vide

- [x] **Task 4: Tests de verification** (AC: tous)
  - [x] 4.1 Build TypeScript reussi
  - [x] 4.2 Lint des fichiers modifies OK
  - [x] 4.3 Tests manuels a effectuer par l'utilisateur

---

## Dev Notes

### Composant StatusFilter

**Fichier : `src/components/library/StatusFilter.tsx`**

```typescript
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import type { BookStatus } from '@/types/book'

type FilterValue = BookStatus | 'all'

interface StatusFilterProps {
  value: FilterValue
  onChange: (value: FilterValue) => void
  counts: {
    all: number
    to_read: number
    reading: number
    read: number
  }
}

const filterOptions: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'to_read', label: 'A lire' },
  { value: 'reading', label: 'En cours' },
  { value: 'read', label: 'Lu' },
]

export function StatusFilter({ value, onChange, counts }: StatusFilterProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(newValue) => {
        // Prevent deselection - always have a value
        if (newValue) {
          onChange(newValue as FilterValue)
        }
      }}
      className="justify-start"
      aria-label="Filtrer par statut"
    >
      {filterOptions.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={`${option.label} (${counts[option.value]} livres)`}
          className={cn(
            'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
            'px-3 py-2'
          )}
        >
          {option.label}
          <span className="ml-1.5 text-xs opacity-70">
            ({counts[option.value]})
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
```

---

### Composant FilteredEmptyState

**Fichier : `src/components/library/FilteredEmptyState.tsx`**

```typescript
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import type { BookStatus } from '@/types/book'

interface FilteredEmptyStateProps {
  status: BookStatus
  onResetFilter: () => void
}

const statusLabels: Record<BookStatus, string> = {
  to_read: 'a lire',
  reading: 'en cours',
  read: 'lu',
}

export function FilteredEmptyState({
  status,
  onResetFilter,
}: FilteredEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Search className="h-12 w-12 text-muted-foreground mb-4" />

      <h2 className="text-xl font-semibold mb-2">
        Aucun livre "{statusLabels[status]}"
      </h2>

      <p className="text-muted-foreground mb-6 max-w-sm">
        Vous n'avez pas de livre avec ce statut actuellement.
      </p>

      <Button variant="outline" onClick={onResetFilter}>
        Voir tous les livres
      </Button>
    </div>
  )
}
```

---

### Integration dans BooksPage

**Modifier : `src/pages/BooksPage.tsx` (extrait)**

```typescript
import { useState, useEffect, useMemo, useRef } from 'react'
import { toast } from 'sonner'
import { BookPlus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getBooks, addBook, updateBook, deleteBook } from '@/lib/books'
import { Button } from '@/components/ui/button'
import { BookList } from '@/components/library/BookList'
import { BookListSkeleton } from '@/components/library/SkeletonCard'
import { EmptyLibrary } from '@/components/library/EmptyLibrary'
import { StatusFilter } from '@/components/library/StatusFilter'
import { FilteredEmptyState } from '@/components/library/FilteredEmptyState'
import { BookFormDialog } from '@/components/book/BookFormDialog'
import { DeleteConfirmDialog } from '@/components/book/DeleteConfirmDialog'
import type { Book, BookStatus } from '@/types/book'
import type { BookFormData } from '@/schemas/book'

type FilterValue = BookStatus | 'all'

export default function BooksPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter state
  const [filterStatus, setFilterStatus] = useState<FilterValue>('all')

  // ... autres states existants ...

  // Calculer les livres filtres
  const filteredBooks = useMemo(() => {
    if (filterStatus === 'all') {
      return books
    }
    return books.filter((book) => book.status === filterStatus)
  }, [books, filterStatus])

  // Calculer les compteurs par statut
  const counts = useMemo(() => {
    return {
      all: books.length,
      to_read: books.filter((b) => b.status === 'to_read').length,
      reading: books.filter((b) => b.status === 'reading').length,
      read: books.filter((b) => b.status === 'read').length,
    }
  }, [books])

  // Reset filter
  const handleResetFilter = () => {
    setFilterStatus('all')
  }

  // ... autres handlers existants ...

  return (
    <div className="container py-6">
      {/* Header avec titre et bouton ajouter */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ma Bibliotheque</h1>
          <p className="text-muted-foreground">
            {filteredBooks.length} livre{filteredBooks.length !== 1 ? 's' : ''}
            {filterStatus !== 'all' && ` (filtre: ${filterStatus})`}
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

      {/* Filtres - visible uniquement si des livres existent */}
      {!isLoading && !error && books.length > 0 && (
        <div className="mb-6 overflow-x-auto">
          <StatusFilter
            value={filterStatus}
            onChange={setFilterStatus}
            counts={counts}
          />
        </div>
      )}

      {/* Contenu principal */}
      {isLoading ? (
        <BookListSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={fetchBooks}>
            Reessayer
          </Button>
        </div>
      ) : books.length === 0 ? (
        // Bibliotheque completement vide
        <EmptyLibrary onAddBook={() => setIsAddDialogOpen(true)} />
      ) : filteredBooks.length === 0 ? (
        // Filtre sans resultat
        <FilteredEmptyState
          status={filterStatus as BookStatus}
          onResetFilter={handleResetFilter}
        />
      ) : (
        // Liste des livres
        <BookList
          books={filteredBooks}
          onEditBook={handleEditBook}
          onDeleteBook={handleDeleteBook}
          onStatusChange={handleStatusChange}
        />
      )}

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

      {/* ... dialogs existants ... */}
    </div>
  )
}
```

---

## Project Structure Notes

### Fichiers crees/modifies

| Fichier | Action | Description |
|---------|--------|-------------|
| `src/components/library/StatusFilter.tsx` | Creer | Toggle Group filtrage |
| `src/components/library/FilteredEmptyState.tsx` | Creer | Message filtre vide |
| `src/pages/BooksPage.tsx` | Modifier | Integration filtrage |

### Shadcn/ui Composants requis

```bash
npx shadcn@latest add toggle-group
```

---

## UX Requirements

[Source: docs/ux-design-specification.md#StatusFilter]

### StatusFilter Anatomy

```
┌─────────────────────────────────────────────────┐
│  [Tous (42)]  [A lire (15)]  [En cours (5)]  [Lu (22)]  │
└─────────────────────────────────────────────────┘
```

### Comportement

- Selection unique (radio-like)
- Compteurs dynamiques
- Filtrage instantane (cote client)
- Pas de rechargement serveur

### Filtre sans resultat

- Icone de recherche
- Message "Aucun livre [statut]"
- Bouton "Voir tous les livres"

---

## Architecture Compliance Checklist

- [x] StatusFilter dans `src/components/library/`
- [x] FilteredEmptyState dans `src/components/library/`
- [x] ToggleGroup de Shadcn/ui utilise
- [x] Filtrage via useMemo (cote client)
- [x] Compteurs via useMemo
- [x] Filtre "all" par defaut
- [x] Pas de requete serveur pour filtrage
- [x] Mise a jour automatique des compteurs

---

## Dependencies

### Story Dependencies

| Dependance | Type | Statut |
|------------|------|--------|
| Story 2.2 | Bloquante | ready-for-dev |
| Story 2.3 | Bloquante | ready-for-dev |

### Technical Dependencies

Aucune nouvelle dependance.

---

## Testing Requirements

### Tests manuels

1. **Affichage initial** :
   - Ouvrir la page → "Tous" selectionne
   - Compteurs corrects pour chaque statut

2. **Filtrage** :
   - Cliquer "A lire" → seulement les livres to_read
   - Cliquer "En cours" → seulement les livres reading
   - Cliquer "Lu" → seulement les livres read

3. **Filtre vide** :
   - Filtrer sur un statut sans livres
   - Message "Aucun livre [statut]" affiche
   - Cliquer "Voir tous" → retour a tous les livres

4. **Compteurs dynamiques** :
   - Ajouter un livre "A lire"
   - Compteur "A lire" augmente de 1
   - Supprimer un livre → compteurs mis a jour

5. **Performance** :
   - Filtrage instantane (pas de loading)
   - Pas de requete reseau visible dans DevTools

---

## Performance Considerations

- Filtrage cote client via `useMemo` evite les requetes serveur
- Les compteurs sont recalcules uniquement quand `books` change
- Les livres filtres sont recalcules uniquement quand `books` ou `filterStatus` changent

---

## Accessibility Considerations

### StatusFilter

- `role="radiogroup"` via ToggleGroup
- `aria-label` sur chaque option avec compteur
- Navigation clavier entre les options

### FilteredEmptyState

- Message clair sur l'etat
- Action evidente pour reinitialiser

---

## References

- [Source: docs/architecture.md#Frontend Architecture]
- [Source: docs/ux-design-specification.md#StatusFilter]
- [Source: docs/ux-design-specification.md#Empty State]
- [Source: docs/epics.md#Story 2.7]
- [Source: CLAUDE.md#Responsive Breakpoints]

---

## Dev Agent Record

### Context Reference

Story context generated by SM agent (Bob) on 2025-12-18.
Vertical slice approach: UI + Logic (pas de data layer).
Cette story implemente FR-2.5 (Filtrer les livres).
C'est la derniere story de l'Epic 2.

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes List

- Implemente le 2025-12-19 par Dev Agent (Amelia)
- ToggleGroup de Shadcn/ui installe via `npx shadcn@latest add toggle-group`
- StatusFilter cree avec props: value, onChange, counts
- FilteredEmptyState cree avec props: status, onResetFilter
- Filtrage cote client via useMemo (pas de requete serveur)
- Compteurs dynamiques via useMemo
- Affichage conditionnel selon filterStatus
- Build TypeScript OK, lint OK sur fichiers modifies
- Tests manuels requis pour validation complete
- **EPIC 2 COMPLETE - 100% des FRs implementes**

### File List

| Fichier | Action | Description |
|---------|--------|-------------|
| `ma-bibliotheque/src/components/ui/toggle.tsx` | Cree | Composant Shadcn/ui Toggle |
| `ma-bibliotheque/src/components/ui/toggle-group.tsx` | Cree | Composant Shadcn/ui ToggleGroup |
| `ma-bibliotheque/src/components/library/StatusFilter.tsx` | Cree | Filtre par statut avec compteurs |
| `ma-bibliotheque/src/components/library/FilteredEmptyState.tsx` | Cree | Etat vide pour filtre sans resultat |
| `ma-bibliotheque/src/pages/BooksPage.tsx` | Modifie | Integration filtrage + useMemo |

---

## Story Ready Checklist

- [x] User story statement complete
- [x] Acceptance criteria detailles avec Given/When/Then
- [x] Vertical slice coverage (UI + Logic)
- [x] Tasks decomposees en subtasks actionnables
- [x] Dev notes avec code complet et fonctionnel
- [x] Architecture compliance verifiee
- [x] Dependencies identifiees
- [x] UX requirements documentes
- [x] Performance considerations documentees
- [x] Accessibility considerations documentees
- [x] References aux documents sources
- [x] Testing requirements definis

**Status: READY FOR DEVELOPMENT**

---

## Epic 2 Completion Note

Avec cette story, **Epic 2 (Gestion de la Bibliotheque)** est complet :

| Story | Description | FRs |
|-------|-------------|-----|
| 2.1 | Service layer et types | - |
| 2.2 | Page bibliotheque et liste | FR-2.1 |
| 2.3 | BookCard avec StatusBadge | FR-3.1, FR-3.2, FR-3.3 |
| 2.4 | Ajout de livre | FR-2.2 |
| 2.5 | Modification de livre | FR-2.3 |
| 2.6 | Suppression avec confirmation | FR-2.4 |
| 2.7 | Filtrage par statut | FR-2.5 |

**Couverture FR-2 et FR-3 : 100%** (8/8 FRs implementes)

**Projet complet apres Epic 1 + Epic 2 :**
- 12 stories total (5 + 7)
- 12 FRs implementes (100%)
- MVP fonctionnel
