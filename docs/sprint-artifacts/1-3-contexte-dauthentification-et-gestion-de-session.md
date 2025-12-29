# Story 1.3: Contexte d'authentification et gestion de session

**Status:** Ready for Review
**Story Points:** 5
**Priority:** P0 - Critique (bloque Stories 1.4, 1.5 et tout Epic 2)

---

## Story

As a **utilisateur**,
I want **que ma session soit geree automatiquement**,
So that **je reste connecte entre les visites**.

---

## Acceptance Criteria

### AC1: Creation du AuthContext avec toutes les proprietes

**Given** le fichier `src/contexts/AuthContext.tsx` cree
**When** j'implemente le AuthContext
**Then** il expose les proprietes suivantes :
- `user` : L'utilisateur connecte (ou null)
- `session` : La session Supabase active (ou null)
- `isLoading` : Boolean indiquant le chargement initial
- `signUp` : Fonction d'inscription
- `signIn` : Fonction de connexion
- `signOut` : Fonction de deconnexion

### AC2: Hook useAuth() fonctionnel

**Given** le AuthContext implemente
**When** j'utilise le hook `useAuth()` dans un composant
**Then** j'ai acces a toutes les proprietes du contexte
**And** une erreur est levee si utilise hors du AuthProvider

### AC3: Detection automatique de session existante

**Given** l'application chargee
**When** Supabase Auth detecte une session existante (cookie/localStorage)
**Then** l'utilisateur est automatiquement connecte
**And** `user` et `session` sont remplis avec les donnees
**And** `isLoading` passe de `true` a `false` une fois la verification terminee

### AC4: Etat de chargement initial

**Given** l'application en cours de chargement
**When** la verification de session est en cours
**Then** `isLoading` est `true`
**And** les composants peuvent afficher un etat de chargement
**And** aucune redirection ne se fait pendant le chargement

### AC5: Ecoute des changements d'authentification

**Given** le AuthContext initialise
**When** l'etat d'authentification change (connexion, deconnexion, expiration)
**Then** le contexte est mis a jour automatiquement
**And** tous les composants consommateurs sont re-rendus

### AC6: AuthProvider englobe l'application

**Given** le fichier `src/App.tsx`
**When** je configure le routing
**Then** AuthProvider englobe tous les composants de l'application
**And** le contexte est disponible partout dans l'arbre React

---

## Tasks / Subtasks

- [x] **Task 1: Creation des types d'authentification** (AC: 1, 2)
  - [x] 1.1 Creer le fichier `src/types/auth.ts`
  - [x] 1.2 Definir l'interface `AuthContextType`
  - [x] 1.3 Definir les types pour les fonctions signUp, signIn, signOut

- [x] **Task 2: Implementation du AuthContext** (AC: 1, 2, 3, 4, 5)
  - [x] 2.1 Creer le fichier `src/contexts/AuthContext.tsx`
  - [x] 2.2 Creer le contexte avec `createContext`
  - [x] 2.3 Implementer le AuthProvider avec useState pour user, session, isLoading
  - [x] 2.4 Implementer `useEffect` pour verifier la session au montage
  - [x] 2.5 Implementer `onAuthStateChange` pour ecouter les changements
  - [x] 2.6 Implementer la fonction `signUp`
  - [x] 2.7 Implementer la fonction `signIn`
  - [x] 2.8 Implementer la fonction `signOut`
  - [x] 2.9 Creer et exporter le hook `useAuth()`

- [x] **Task 3: Integration dans App.tsx** (AC: 6)
  - [x] 3.1 Importer AuthProvider dans App.tsx
  - [x] 3.2 Englober le contenu de l'application avec AuthProvider
  - [x] 3.3 Verifier que le contexte est disponible

- [x] **Task 4: Tests manuels de verification** (AC: 3, 4, 5)
  - [x] 4.1 Tester le chargement initial (isLoading = true puis false)
  - [x] 4.2 Tester la persistance de session (refresh page) - Note: test complet necessite Story 1.4
  - [x] 4.3 Tester la deconnexion (session cleared) - Note: test complet necessite Story 1.4

---

## Dev Notes

### Types d'authentification

**Fichier : `src/types/auth.ts`**

```typescript
import { Session, User } from '@supabase/supabase-js'

export interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}
```

### Implementation complete du AuthContext

**Fichier : `src/contexts/AuthContext.tsx`**

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { AuthContextType } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Recuperer la session initiale
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    }

    getInitialSession()

    // Ecouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### Integration dans App.tsx

**Fichier : `src/App.tsx`**

```typescript
import { AuthProvider } from '@/contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      {/* Le reste de l'application ira ici */}
      {/* React Router sera ajoute dans Story 1.5 */}
      <div className="min-h-screen bg-background">
        <p className="p-4 text-foreground">Ma Bibliotheque - Auth Ready</p>
      </div>
    </AuthProvider>
  )
}

export default App
```

### Test temporaire du contexte

**Composant de test (temporaire) :**

```typescript
import { useAuth } from '@/contexts/AuthContext'

function AuthStatus() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <p>Chargement...</p>
  }

  return (
    <p>
      {user ? `Connecte: ${user.email}` : 'Non connecte'}
    </p>
  )
}
```

---

## Project Structure Notes

### Fichiers crees dans cette story

| Fichier | Action | Description |
|---------|--------|-------------|
| `src/types/auth.ts` | Creer | Types TypeScript pour l'authentification |
| `src/contexts/AuthContext.tsx` | Creer | Contexte React + Provider + hook useAuth |
| `src/App.tsx` | Modifier | Ajout AuthProvider |

### Alignement avec l'Architecture

[Source: docs/architecture.md#Authentication & Security]

- **Auth provider** : Supabase Auth (PRD requirement)
- **Session management** : AuthContext (Standard React pattern)
- **Auth Flow** : User visits → AuthContext checks session → Redirect or access

### Conventions de nommage

| Element | Convention | Appliquee |
|---------|------------|-----------|
| Context | PascalCase | `AuthContext` |
| Provider | PascalCase + Provider | `AuthProvider` |
| Hook | camelCase + use | `useAuth` |
| Types | PascalCase | `AuthContextType` |

---

## Technical Requirements from Architecture

### Pattern d'authentification

[Source: docs/architecture.md#Frontend Architecture]

```
App.tsx (AuthProvider)
      ↓
  AuthContext.tsx (state + functions)
      ↓
  ProtectedRoute.tsx (guard) ← Story 1.5
      ↓
  Protected Pages (BooksPage)
```

### State Management

[Source: docs/architecture.md#Core Architectural Decisions]

- **Decision** : React useState + Context
- **Rationale** : Sufficient for app complexity
- **Implementation** : useState pour user, session, isLoading dans AuthContext

### Loading State Pattern

[Source: docs/architecture.md#Process Patterns]

```typescript
const [isLoading, setIsLoading] = useState(true)

// Dans useEffect
setIsLoading(false) // Une fois la verification terminee
```

---

## Architecture Compliance Checklist

- [x] AuthContext dans `src/contexts/AuthContext.tsx`
- [x] Types dans `src/types/auth.ts`
- [x] Hook useAuth() exporte et fonctionnel
- [x] AuthProvider englobe l'application dans App.tsx
- [x] Proprietes exposees : user, session, isLoading, signUp, signIn, signOut
- [x] Ecoute onAuthStateChange configuree
- [x] Cleanup de subscription dans useEffect
- [x] Erreur si useAuth() utilise hors AuthProvider

---

## Dependencies

### Story Dependencies

| Dependance | Type | Statut |
|------------|------|--------|
| Story 1.1 | Bloquante | ready-for-dev |
| Story 1.2 | Bloquante | ready-for-dev |

**Note :** Cette story necessite que le client Supabase soit configure (Story 1.2).

### Technical Dependencies

| Package | Usage |
|---------|-------|
| @supabase/supabase-js | Types User, Session + auth methods |
| react | createContext, useContext, useState, useEffect |

---

## Testing Requirements

### Tests manuels obligatoires

1. **Chargement initial** :
   - Ouvrir l'app → isLoading = true brievement → isLoading = false
   - Console: pas d'erreur

2. **Sans session** :
   - user = null, session = null
   - isLoading = false apres verification

3. **Avec session** (necessite Story 1.4 pour creer un compte) :
   - Apres connexion, user et session sont remplis
   - Refresh page → session persiste

4. **Hook useAuth** :
   - Utiliser hors AuthProvider → erreur "useAuth must be used within an AuthProvider"

### Test du cleanup

```typescript
// Dans la console React DevTools
// Verifier que la subscription est bien nettoyee au demontage
```

---

## Security Considerations

### Gestion de session

- Supabase gere automatiquement les tokens JWT
- Les tokens sont stockes dans localStorage par defaut
- onAuthStateChange detecte les expirations et refresh automatiques

### Protection des donnees

- Ne jamais exposer le session.access_token dans l'UI
- Utiliser uniquement user.email, user.id pour l'affichage
- Les appels Supabase utilisent automatiquement le token de session

---

## UX Considerations

### Etat de chargement

[Source: docs/ux-design-specification.md#Loading Patterns]

- Pendant `isLoading = true`, afficher un skeleton ou spinner
- Ne pas rediriger tant que isLoading est true
- Transition fluide vers l'etat authentifie/non-authentifie

### Messages d'erreur

Les fonctions signUp et signIn retournent `{ error }` pour permettre aux composants appelants de gerer les erreurs avec des toasts (Story 1.4).

---

## References

- [Source: docs/architecture.md#Authentication & Security]
- [Source: docs/architecture.md#Frontend Architecture]
- [Source: docs/architecture.md#Core Architectural Decisions]
- [Source: docs/architecture.md#Process Patterns]
- [Source: docs/epics.md#Story 1.3]
- [Source: docs/ux-design-specification.md#Loading Patterns]

---

## Dev Agent Record

### Context Reference

Story context generated by SM agent (Bob) on 2025-12-18.
Complete architecture, UX, and PRD documents analyzed.
Previous stories (1.1, 1.2) reviewed for context continuity.

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes List

- **2025-12-18**: Implementation complete du AuthContext
  - Types auth crees avec import type pour verbatimModuleSyntax
  - AuthContext avec user, session, isLoading, signUp, signIn, signOut
  - useAuth hook avec erreur si utilise hors AuthProvider
  - AuthProvider integre dans App.tsx
  - Build passe sans erreur
  - Tests manuels: app se charge, pas d'erreur console
  - Tests de session complets (4.2, 4.3) necessitent Story 1.4

### File List

| Fichier | Action |
|---------|--------|
| `ma-bibliotheque/src/types/auth.ts` | Cree |
| `ma-bibliotheque/src/contexts/AuthContext.tsx` | Cree |
| `ma-bibliotheque/src/App.tsx` | Modifie |

### Change Log

- 2025-12-18: Story 1.3 implementee - AuthContext, types, integration App.tsx

---

## Story Ready Checklist

- [x] User story statement complete
- [x] Acceptance criteria detailles avec Given/When/Then
- [x] Tasks decomposees en subtasks actionnables
- [x] Dev notes avec code complet
- [x] Architecture compliance verifiee
- [x] Dependencies identifiees
- [x] Security considerations documentees
- [x] UX considerations documentees
- [x] References aux documents sources
- [x] Testing requirements definis

**Status: READY FOR REVIEW**
