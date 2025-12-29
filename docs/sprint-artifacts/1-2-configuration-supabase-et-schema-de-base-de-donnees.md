# Story 1.2: Configuration Supabase et schema de base de donnees

**Status:** Ready for Review
**Story Points:** 3
**Priority:** P0 - Critique (bloque FR-1.4 et toutes les stories Epic 2)

---

## Story

As a **developpeur**,
I want **Supabase configure avec le schema de donnees**,
So that **l'application puisse stocker et isoler les donnees utilisateur**.

---

## Acceptance Criteria

### AC1: Configuration du client Supabase

**Given** un projet Supabase existant
**When** je configure le client Supabase dans `src/lib/supabase.ts`
**Then** le client utilise les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
**And** le client est exporte et pret a l'emploi
**And** les types TypeScript sont corrects

### AC2: Documentation des variables d'environnement

**Given** le client Supabase configure
**When** je verifie le fichier `.env.example`
**Then** il contient les deux variables requises avec des placeholders
**And** le fichier `.env.local` est dans `.gitignore`

### AC3: Creation de la table books

**Given** le client Supabase configure
**When** je cree la table `books` via migration SQL dans Supabase Dashboard
**Then** la table contient les colonnes :
- `id` (uuid, PRIMARY KEY, auto-genere)
- `user_id` (uuid, REFERENCES auth.users, NOT NULL)
- `title` (text, NOT NULL)
- `author` (text, NOT NULL)
- `status` (text, NOT NULL)
- `created_at` (timestamptz, DEFAULT now())
- `updated_at` (timestamptz, DEFAULT now())

### AC4: Contrainte CHECK sur le statut

**Given** la table `books` creee
**When** je verifie les contraintes
**Then** une contrainte CHECK limite le champ `status` aux valeurs : 'to_read', 'reading', 'read'
**And** toute insertion/mise a jour avec une valeur invalide est rejetee

### AC5: Row Level Security (RLS) active

**Given** la table `books` creee
**When** je configure les politiques RLS
**Then** RLS est active sur la table books
**And** chaque utilisateur ne peut voir que ses propres livres (FR-1.4)
**And** chaque utilisateur ne peut modifier que ses propres livres
**And** chaque utilisateur ne peut supprimer que ses propres livres
**And** l'insertion force automatiquement le user_id de l'utilisateur connecte

### AC6: Test de connexion reussi

**Given** le client Supabase configure et la table creee
**When** je teste la connexion depuis l'application
**Then** aucune erreur de connexion
**And** la table books est accessible (meme si vide)

---

## Tasks / Subtasks

- [x] **Task 1: Configuration du client Supabase** (AC: 1, 2)
  - [x] 1.1 Creer le fichier `src/lib/supabase.ts`
  - [x] 1.2 Importer `createClient` depuis `@supabase/supabase-js`
  - [x] 1.3 Recuperer les variables d'environnement avec `import.meta.env`
  - [x] 1.4 Creer et exporter le client Supabase
  - [x] 1.5 Verifier que `.env.example` contient les variables (deja cree Story 1.1)
  - [x] 1.6 Creer `.env.local` avec les vraies valeurs (gitignore)

- [x] **Task 2: Installation de la dependance Supabase** (AC: 1)
  - [x] 2.1 Executer `npm install @supabase/supabase-js`
  - [x] 2.2 Verifier l'ajout dans package.json

- [x] **Task 3: Creation de la table books dans Supabase** (AC: 3, 4)
  - [x] 3.1 Ouvrir Supabase Dashboard > SQL Editor
  - [x] 3.2 Executer le script SQL de creation de table
  - [x] 3.3 Verifier la creation dans Table Editor
  - [x] 3.4 Verifier la contrainte CHECK sur status

- [x] **Task 4: Configuration des politiques RLS** (AC: 5)
  - [x] 4.1 Activer RLS sur la table books
  - [x] 4.2 Creer la politique SELECT (lecture propres livres)
  - [x] 4.3 Creer la politique INSERT (ajout propres livres)
  - [x] 4.4 Creer la politique UPDATE (modification propres livres)
  - [x] 4.5 Creer la politique DELETE (suppression propres livres)

- [x] **Task 5: Test de verification** (AC: 6)
  - [x] 5.1 Lancer l'application `npm run dev`
  - [x] 5.2 Ajouter un log temporaire pour tester la connexion Supabase
  - [x] 5.3 Verifier dans la console qu'il n'y a pas d'erreur
  - [x] 5.4 Supprimer le log temporaire

---

## Dev Notes

### Installation de la dependance

```bash
npm install @supabase/supabase-js
```

### Configuration du client Supabase

**Fichier : `src/lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Fichier .env.local (a creer, gitignore)

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Script SQL de creation de la table books

**A executer dans Supabase Dashboard > SQL Editor**

```sql
-- Creation de la table books
CREATE TABLE books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  author text NOT NULL,
  status text NOT NULL CHECK (status IN ('to_read', 'reading', 'read')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index sur user_id pour performance des requetes filtrees
CREATE INDEX idx_books_user_id ON books(user_id);

-- Index sur status pour performance du filtrage
CREATE INDEX idx_books_status ON books(status);

-- Commentaire sur la table
COMMENT ON TABLE books IS 'Collection de livres des utilisateurs avec statut de lecture';
```

### Script SQL pour les politiques RLS

**A executer dans Supabase Dashboard > SQL Editor**

```sql
-- Activer Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Politique SELECT : Un utilisateur ne peut voir que ses propres livres
CREATE POLICY "Users can view their own books"
ON books FOR SELECT
USING (auth.uid() = user_id);

-- Politique INSERT : Un utilisateur ne peut inserer que pour lui-meme
CREATE POLICY "Users can insert their own books"
ON books FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Politique UPDATE : Un utilisateur ne peut modifier que ses propres livres
CREATE POLICY "Users can update their own books"
ON books FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Politique DELETE : Un utilisateur ne peut supprimer que ses propres livres
CREATE POLICY "Users can delete their own books"
ON books FOR DELETE
USING (auth.uid() = user_id);
```

### Fonction trigger pour updated_at (optionnel mais recommande)

```sql
-- Fonction pour mettre a jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger sur la table books
CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### Test temporaire de connexion

**Dans `src/App.tsx` (temporaire, a supprimer apres test)**

```typescript
import { supabase } from '@/lib/supabase'

// Dans le composant App, ajouter temporairement :
useEffect(() => {
  const testConnection = async () => {
    const { data, error } = await supabase.from('books').select('count')
    if (error) {
      console.error('Supabase connection error:', error)
    } else {
      console.log('Supabase connected successfully')
    }
  }
  testConnection()
}, [])
```

---

## Project Structure Notes

### Fichiers crees/modifies dans cette story

| Fichier | Action | Description |
|---------|--------|-------------|
| `src/lib/supabase.ts` | Creer | Client Supabase initialise |
| `.env.local` | Creer | Variables d'environnement reelles |
| `package.json` | Modifier | Ajout dependance @supabase/supabase-js |

### Alignement avec l'Architecture

- **Data Architecture** : Supabase PostgreSQL comme specifie [Source: docs/architecture.md#Data Architecture]
- **Security** : RLS comme mecanisme d'isolation des donnees [Source: docs/architecture.md#Authentication & Security]
- **Environment Variables** : Prefixe VITE_ obligatoire pour Vite [Source: docs/architecture.md#Infrastructure & Deployment]

### Conventions de nommage

| Element | Convention | Appliquee |
|---------|------------|-----------|
| Table | snake_case | `books` |
| Colonnes | snake_case | `user_id`, `created_at` |
| Policies | Descriptive English | "Users can view their own books" |

---

## Technical Requirements from Architecture

### Schema de donnees obligatoire

[Source: docs/architecture.md#Format Patterns]

```typescript
interface Book {
  id: string
  user_id: string
  title: string
  author: string
  status: 'to_read' | 'reading' | 'read'
  created_at: string
  updated_at: string
}
```

### Pattern Service Layer

[Source: docs/architecture.md#Data Architecture]

Le client Supabase sera utilise exclusivement via les service functions dans `lib/books.ts` (Story 2.1). Cette story se limite a la configuration du client.

### Contraintes techniques

| Contrainte | Impact |
|------------|--------|
| Pas d'Edge Functions | Pas de logique serveur custom |
| Pas de Storage | Pas de stockage d'images |
| Pas de Realtime | Pas de subscriptions, refresh manuel |

---

## Architecture Compliance Checklist

- [x] Client Supabase dans `src/lib/supabase.ts`
- [x] Variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
- [x] Table books avec schema exact (7 colonnes + contrainte CHECK)
- [x] RLS active avec 4 politiques (SELECT, INSERT, UPDATE, DELETE)
- [x] Index sur user_id et status pour performance
- [x] Trigger updated_at (optionnel mais recommande)
- [x] `.env.local` dans `.gitignore`

---

## Dependencies

### Story Dependencies

| Dependance | Type | Statut |
|------------|------|--------|
| Story 1.1 | Bloquante | ready-for-dev |

**Note :** Cette story necessite que Story 1.1 soit completee (projet initialise, structure creee).

### External Dependencies

| Service | Prerequis |
|---------|-----------|
| Supabase | Projet cree avec Auth active |
| Supabase | URL et Anon Key disponibles |

---

## Testing Requirements

### Tests manuels obligatoires

1. **Connexion** : `npm run dev` sans erreur de connexion Supabase
2. **Table** : Visible dans Supabase Dashboard > Table Editor
3. **RLS** : Tentative de requete sans auth doit echouer
4. **Contrainte** : INSERT avec status='invalid' doit echouer

### Test de la contrainte CHECK

**Dans Supabase SQL Editor :**

```sql
-- Doit echouer avec erreur de contrainte
INSERT INTO books (user_id, title, author, status)
VALUES ('00000000-0000-0000-0000-000000000000', 'Test', 'Author', 'invalid');
```

### Test RLS (via Supabase Dashboard)

1. Aller dans Table Editor > books
2. Essayer d'inserer une ligne manuellement
3. Doit voir l'erreur RLS car pas d'auth.uid()

---

## Security Considerations

### Row Level Security (FR-1.4)

- **CRITIQUE** : RLS doit etre active AVANT toute utilisation en production
- Les politiques utilisent `auth.uid()` pour identifier l'utilisateur connecte
- ON DELETE CASCADE sur user_id : si un utilisateur est supprime, ses livres le sont aussi

### Variables d'environnement

- **JAMAIS** committer `.env.local` dans git
- L'anon key est publique mais RLS protege les donnees
- En production, utiliser les variables d'environnement Vercel

---

## References

- [Source: docs/architecture.md#Data Architecture]
- [Source: docs/architecture.md#Authentication & Security]
- [Source: docs/architecture.md#Format Patterns]
- [Source: docs/architecture.md#Infrastructure & Deployment]
- [Source: docs/epics.md#Story 1.2]
- [Source: CLAUDE.md#Database Schema]

---

## Dev Agent Record

### Context Reference

Story context generated by SM agent (Bob) on 2025-12-18.
Complete architecture, UX, and PRD documents analyzed.
Previous story (1.1) reviewed for context continuity.

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes List

Implementation completed on 2025-12-18 by Dev Agent (Amelia).

**Summary:**
- Client Supabase configure dans `src/lib/supabase.ts`
- Dependance `@supabase/supabase-js` installee
- Variables d'environnement configurees dans `.env.local`
- Table `books` creee via MCP Supabase avec 4 migrations:
  - `create_books_table` - Table avec 7 colonnes et contrainte CHECK
  - `create_updated_at_trigger` - Trigger pour mise a jour automatique
  - `enable_rls_and_policies` - RLS active avec 4 politiques de securite
  - `fix_function_search_path` - Correction securite sur la fonction trigger
- Index crees sur `user_id` et `status` pour performance
- Build TypeScript reussit sans erreur
- Audit securite Supabase: aucun avertissement

**Verifications effectuees:**
- `npm run build` - Success
- `mcp__supabase__list_tables` - Table books correctement creee
- `mcp__supabase__get_advisors` - Aucun probleme de securite

### File List

**New Files:**
- `ma-bibliotheque/src/lib/supabase.ts`
- `ma-bibliotheque/.env.local` (gitignored)

**Modified Files:**
- `ma-bibliotheque/package.json` (ajout @supabase/supabase-js)
- `ma-bibliotheque/package-lock.json`

**Supabase Migrations:**
- `create_books_table`
- `create_updated_at_trigger`
- `enable_rls_and_policies`
- `fix_function_search_path`

### Change Log

- 2025-12-18: Story 1.2 implemented - Supabase configuration and database schema complete

---

## Story Ready Checklist

- [x] User story statement complete
- [x] Acceptance criteria detailles avec Given/When/Then
- [x] Tasks decomposees en subtasks actionnables
- [x] Dev notes avec scripts SQL complets
- [x] Architecture compliance verifiee
- [x] Dependencies identifiees
- [x] Security considerations documentees
- [x] References aux documents sources
- [x] Testing requirements definis

**Status: READY FOR DEVELOPMENT**
