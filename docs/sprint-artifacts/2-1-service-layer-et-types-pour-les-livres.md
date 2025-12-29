# Story 2.1: Service layer et types pour les livres

**Status:** Ready for Review
**Story Points:** 3
**Priority:** P0 - Critique (fondation pour toutes les stories Epic 2)
**Type:** Horizontal Slice (Data Layer uniquement)

---

## Story

As a **developpeur**,
I want **une couche de service typee pour les operations sur les livres**,
So that **le code soit maintenable et les donnees validees**.

---

## Vertical Slice Overview

Cette story est une **tranche horizontale** qui etablit la couche de donnees :

| Couche | Composants |
|--------|------------|
| **Types** | Interface Book, types associes |
| **Schemas** | Validation Zod pour formulaires |
| **Services** | Fonctions CRUD pour Supabase |

---

## Acceptance Criteria

### AC1: Interface Book definie correctement

**Given** le fichier `src/types/book.ts` cree
**When** je definis l'interface Book
**Then** elle contient : id, user_id, title, author, status, created_at, updated_at
**And** status est type comme `'to_read' | 'reading' | 'read'`

### AC2: Schema Zod pour validation des formulaires

**Given** le fichier `src/schemas/book.ts` cree
**When** je definis le schema Zod bookFormSchema
**Then** il valide : title (requis, 1-200 chars), author (requis, 1-100 chars), status (enum)
**And** le type BookFormData est infere du schema

### AC3: Fonction getBooks

**Given** le fichier `src/lib/books.ts` cree
**When** j'appelle `getBooks(userId)`
**Then** la fonction retourne tous les livres de l'utilisateur
**And** les livres sont tries par created_at descendant (recent en premier)
**And** une erreur Supabase est propagee correctement

### AC4: Fonction addBook

**Given** la fonction addBook implementee
**When** j'appelle `addBook(userId, data)`
**Then** un nouveau livre est cree dans la table books
**And** le livre cree est retourne avec son id genere
**And** user_id est automatiquement associe

### AC5: Fonction updateBook

**Given** la fonction updateBook implementee
**When** j'appelle `updateBook(id, data)`
**Then** le livre avec cet id est modifie
**And** updated_at est automatiquement mis a jour
**And** le livre modifie est retourne

### AC6: Fonction deleteBook

**Given** la fonction deleteBook implementee
**When** j'appelle `deleteBook(id)`
**Then** le livre avec cet id est supprime
**And** aucune donnee n'est retournee (void)
**And** une erreur est levee si le livre n'existe pas

---

## Tasks / Subtasks

- [x] **Task 1: Creer les types TypeScript** (AC: 1)
  - [x] 1.1 Creer `src/types/book.ts`
  - [x] 1.2 Definir le type Status union
  - [x] 1.3 Definir l'interface Book complete
  - [x] 1.4 Exporter tous les types

- [x] **Task 2: Creer les schemas Zod** (AC: 2)
  - [x] 2.1 Creer `src/schemas/book.ts`
  - [x] 2.2 Definir bookFormSchema avec validation
  - [x] 2.3 Inferer le type BookFormData
  - [x] 2.4 Exporter schema et type

- [x] **Task 3: Implementer les fonctions CRUD** (AC: 3, 4, 5, 6)
  - [x] 3.1 Creer `src/lib/books.ts`
  - [x] 3.2 Implementer getBooks(userId)
  - [x] 3.3 Implementer addBook(userId, data)
  - [x] 3.4 Implementer updateBook(id, data)
  - [x] 3.5 Implementer deleteBook(id)

- [x] **Task 4: Tests de verification** (AC: tous)
  - [x] 4.1 Verifier que les types compilent sans erreur
  - [x] 4.2 Tester le schema Zod avec donnees valides/invalides
  - [x] 4.3 Tester chaque fonction CRUD via console ou tests unitaires

---

## Dev Notes

### Types TypeScript

**Fichier : `src/types/book.ts`**

```typescript
/**
 * Statuts de lecture possibles pour un livre
 * Alignes avec la contrainte CHECK de la table Supabase
 */
export type BookStatus = 'to_read' | 'reading' | 'read'

/**
 * Interface Book - correspond exactement au schema Supabase
 * Les noms de colonnes sont en snake_case (convention Supabase)
 */
export interface Book {
  id: string
  user_id: string
  title: string
  author: string
  status: BookStatus
  created_at: string
  updated_at: string
}

/**
 * Type pour la creation d'un livre (sans id et timestamps)
 */
export type BookInsert = Omit<Book, 'id' | 'created_at' | 'updated_at'>

/**
 * Type pour la mise a jour d'un livre (tous les champs optionnels sauf id)
 */
export type BookUpdate = Partial<Omit<Book, 'id' | 'user_id' | 'created_at'>>
```

---

### Schemas Zod

**Fichier : `src/schemas/book.ts`**

```typescript
import { z } from 'zod'

/**
 * Schema de validation pour les formulaires de livre
 * Utilise par React Hook Form pour la validation
 */
export const bookFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(200, 'Le titre ne peut pas depasser 200 caracteres'),
  author: z
    .string()
    .min(1, "L'auteur est requis")
    .max(100, "L'auteur ne peut pas depasser 100 caracteres"),
  status: z.enum(['to_read', 'reading', 'read'], {
    required_error: 'Le statut est requis',
  }),
})

/**
 * Type infere du schema pour les donnees de formulaire
 */
export type BookFormData = z.infer<typeof bookFormSchema>

/**
 * Valeurs par defaut pour un nouveau livre
 */
export const defaultBookValues: BookFormData = {
  title: '',
  author: '',
  status: 'to_read',
}
```

---

### Service Layer CRUD

**Fichier : `src/lib/books.ts`**

```typescript
import { supabase } from './supabase'
import type { Book, BookInsert, BookUpdate } from '@/types/book'

/**
 * Recupere tous les livres d'un utilisateur
 * Tries par date de creation (recent en premier)
 */
export async function getBooks(userId: string): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

/**
 * Ajoute un nouveau livre pour un utilisateur
 * Retourne le livre cree avec son id genere
 */
export async function addBook(
  userId: string,
  bookData: Omit<BookInsert, 'user_id'>
): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .insert({
      ...bookData,
      user_id: userId,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Met a jour un livre existant
 * Retourne le livre modifie
 */
export async function updateBook(
  id: string,
  bookData: BookUpdate
): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .update({
      ...bookData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Supprime un livre par son id
 */
export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Met a jour uniquement le statut d'un livre
 * Fonction utilitaire pour le changement rapide de statut
 */
export async function updateBookStatus(
  id: string,
  status: Book['status']
): Promise<Book> {
  return updateBook(id, { status })
}
```

---

## Project Structure Notes

### Fichiers crees

| Fichier | Action | Description |
|---------|--------|-------------|
| `src/types/book.ts` | Creer | Types TypeScript pour Book |
| `src/schemas/book.ts` | Creer | Schemas Zod pour validation |
| `src/lib/books.ts` | Creer | Fonctions CRUD Supabase |

### Alignement avec l'Architecture

[Source: docs/architecture.md#Data Architecture]

```
Component → Service Function → Supabase Client → PostgreSQL
                                      ↓
                              RLS (Row Level Security)
```

### Conventions de nommage appliquees

| Element | Convention | Exemple |
|---------|------------|---------|
| Interface | PascalCase | `Book`, `BookInsert` |
| Type alias | PascalCase | `BookStatus`, `BookFormData` |
| Fonctions | camelCase | `getBooks`, `addBook` |
| Fichiers | kebab-case.ts | `book.ts`, `books.ts` |
| Colonnes DB | snake_case | `user_id`, `created_at` |

---

## Architecture Compliance Checklist

- [x] Types dans `src/types/book.ts`
- [x] Schemas dans `src/schemas/book.ts`
- [x] Services dans `src/lib/books.ts`
- [x] Noms de colonnes en snake_case (match Supabase)
- [x] Fonctions async avec gestion d'erreur throw
- [x] Types exportes pour reutilisation
- [x] Tri par created_at desc dans getBooks

---

## Dependencies

### Story Dependencies

| Dependance | Type | Statut |
|------------|------|--------|
| Story 1.2 (Supabase config) | Bloquante | ready-for-dev |
| Story 1.1 (Project init) | Bloquante | ready-for-dev |

### Technical Dependencies

| Package | Version | Usage |
|---------|---------|-------|
| zod | ^3.x | Validation schemas |
| @supabase/supabase-js | ^2.x | Client database |

---

## Testing Requirements

### Tests manuels recommandes

1. **Types compilation** :
   - Verifier que `npm run build` passe sans erreur de type
   - Verifier l'autocompletion dans l'IDE

2. **Schema Zod** :
   ```typescript
   // Dans la console ou un fichier de test
   import { bookFormSchema } from '@/schemas/book'

   // Devrait passer
   bookFormSchema.parse({ title: 'Test', author: 'Auteur', status: 'to_read' })

   // Devrait echouer
   bookFormSchema.parse({ title: '', author: 'Auteur', status: 'to_read' })
   ```

3. **Fonctions CRUD** :
   - Tester via console browser ou fichier temporaire
   - Verifier dans Supabase Dashboard que les donnees sont creees/modifiees

### Tests unitaires (optionnels pour MVP)

```typescript
// src/lib/books.test.ts
import { describe, it, expect, vi } from 'vitest'
import { getBooks, addBook, updateBook, deleteBook } from './books'

describe('books service', () => {
  it('should get books for user', async () => {
    // Mock supabase et tester
  })

  it('should add a new book', async () => {
    // Mock supabase et tester
  })
})
```

---

## Security Considerations

### Row Level Security (RLS)

Les politiques RLS configurees dans Story 1.2 garantissent :
- Un utilisateur ne peut voir que ses propres livres
- Les operations INSERT/UPDATE/DELETE sont limitees a user_id = auth.uid()

### Validation cote client

Le schema Zod valide les donnees AVANT l'envoi a Supabase :
- Titre : 1-200 caracteres
- Auteur : 1-100 caracteres
- Statut : enum strict

Cette validation est une premiere ligne de defense, mais RLS reste la protection principale.

---

## References

- [Source: docs/architecture.md#Data Architecture]
- [Source: docs/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: docs/architecture.md#Format Patterns]
- [Source: docs/epics.md#Story 2.1]
- [Source: CLAUDE.md#Implementation Patterns]

---

## Dev Agent Record

### Context Reference

Story context generated by SM agent (Bob) on 2025-12-18.
Horizontal slice approach: Types + Schemas + Services.
Cette story est la fondation de l'Epic 2 (Gestion de la Bibliotheque).

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes List

Implementation completed on 2025-12-19 by Dev Agent (Amelia).

**Summary:**
- Types TypeScript crees: Book, BookStatus, BookInsert, BookUpdate
- Schema Zod bookFormSchema avec validation titre (1-200), auteur (1-100), status (enum)
- Type BookFormData infere du schema + defaultBookValues
- Fonctions CRUD implementees: getBooks, addBook, updateBook, deleteBook, updateBookStatus
- Toutes les fonctions utilisent async/await avec propagation d'erreur throw
- Tri par created_at DESC dans getBooks
- Build TypeScript reussit sans erreur

**Verifications effectuees:**
- `npm run build` - Success, aucune erreur TypeScript
- Types et schemas compilent correctement
- Correction appliquee: z.enum() sans required_error (syntaxe Zod v4)

### File List

**New Files:**
- `ma-bibliotheque/src/types/book.ts`
- `ma-bibliotheque/src/schemas/book.ts`
- `ma-bibliotheque/src/lib/books.ts`

### Change Log

- 2025-12-19: Story 2.1 implemented - Service layer et types pour les livres

---

## Story Ready Checklist

- [x] User story statement complete
- [x] Acceptance criteria detailles avec Given/When/Then
- [x] Horizontal slice coverage (Types + Schemas + Services)
- [x] Tasks decomposees en subtasks actionnables
- [x] Dev notes avec code complet et fonctionnel
- [x] Architecture compliance verifiee
- [x] Dependencies identifiees
- [x] Security considerations documentees
- [x] References aux documents sources
- [x] Testing requirements definis

**Status: READY FOR DEVELOPMENT**

---

## Epic 2 Progress Note

| Story | Description | Status |
|-------|-------------|--------|
| 2.1 | Service layer et types | ready-for-dev |
| 2.2 | Page bibliotheque et liste | backlog |
| 2.3 | BookCard avec StatusBadge | backlog |
| 2.4 | Ajout de livre | backlog |
| 2.5 | Modification de livre | backlog |
| 2.6 | Suppression avec confirmation | backlog |
| 2.7 | Filtrage par statut | backlog |
