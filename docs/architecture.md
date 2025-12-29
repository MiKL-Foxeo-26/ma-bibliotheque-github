---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
completedAt: '2025-12-17'
inputDocuments:
  - docs/prd/index.md
  - docs/prd/executive-summary.md
  - docs/prd/project-classification.md
  - docs/prd/success-criteria.md
  - docs/prd/product-scope.md
  - docs/prd/user-journey.md
  - docs/prd/functional-requirements.md
  - docs/prd/non-functional-requirements.md
  - docs/prd/data-model.md
  - docs/prd/uiux-requirements.md
  - docs/prd/contraintes-techniques.md
  - docs/ux-design-specification.md
workflowType: 'architecture'
lastStep: 0
project_name: 'Ma Bibliotheque'
user_name: 'MiKL'
date: '2025-12-17'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- **FR-1 Authentification** (4 FRs) : Création de compte, connexion, déconnexion, isolation des données
- **FR-2 Gestion des livres** (5 FRs) : Liste, ajout, modification, suppression, filtrage
- **FR-3 Statuts de lecture** (3 FRs) : À lire, En cours, Lu

Total : 12 exigences fonctionnelles, toutes priorité "Must"

**Non-Functional Requirements:**
- Performance : Chargement < 3s, mutations < 1s, filtrage instantané
- Sécurité : Supabase Auth + RLS, HTTPS obligatoire
- Disponibilité : Vercel (99.9% uptime) + Supabase managed
- Compatibilité : Navigateurs modernes, responsive mobile-first

**Scale & Complexity:**
- Primary domain: Web Application (SPA)
- Complexity level: Low
- Estimated architectural components: ~15 (auth, data layer, UI components)

### Technical Constraints & Dependencies

| Contrainte | Impact architectural |
|------------|---------------------|
| Pas d'Edge Functions | Toute logique métier dans React |
| Pas de Storage | Pas de gestion d'images |
| Pas de Realtime | Pas de subscriptions, refresh manuel |
| Stack fixée | React 18 + Vite + Shadcn/ui + Supabase |

### Cross-Cutting Concerns Identified

1. **Gestion d'état** : État des livres, filtres actifs, formulaires
2. **Authentification** : Session, protection des routes, tokens
3. **Gestion d'erreurs** : Réseau, validation, feedback utilisateur
4. **Responsive design** : Composants adaptatifs par breakpoint
5. **Accessibilité** : WCAG 2.1 AA, focus management, ARIA

## Starter Template Evaluation

### Primary Technology Domain

Web Application (SPA) based on project requirements analysis - React frontend with Supabase backend-as-a-service.

### Starter Options Considered

| Option | Evaluated | Decision |
|--------|-----------|----------|
| Vite + React-TS | Official template, modern tooling | Selected |
| Create React App | Deprecated, slow builds | Rejected |
| Next.js | SSR overkill for simple SPA | Rejected |
| T3 Stack | Too complex for project scope | Rejected |

### Selected Starter: Vite + React-TS + Shadcn/ui

**Rationale for Selection:**
- Exact match with PRD-specified stack (React 18, Vite 5.x, Shadcn/ui)
- Minimal complexity aligned with project's "radical simplicity" philosophy
- Modern tooling with fast development experience
- Progressive enhancement approach - add dependencies as needed

**Initialization Command:**

```bash
npm create vite@latest ma-bibliotheque -- --template react-ts
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- TypeScript 5.x with strict configuration
- React 18.x with concurrent mode support
- ESM modules throughout

**Styling Solution:**
- Tailwind CSS v4 via Vite plugin
- CSS variables for theming (TweakCN compatible)
- Native dark mode support via class strategy

**Build Tooling:**
- Vite 6.x with ESBuild for development
- Rollup for production builds
- Automatic tree-shaking and code splitting

**Code Organization:**
- Path aliases configured (@/ → src/)
- Component-based folder structure
- Separation of UI components from business logic

**Development Experience:**
- Instant Hot Module Replacement
- Full TypeScript IntelliSense
- Built-in error overlay

**Note:** Project initialization using these commands should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- State management: React useState + Context
- Form handling: React Hook Form + Zod
- Data layer: Service functions in lib/
- Auth pattern: AuthContext with ProtectedRoute

**Important Decisions (Shape Architecture):**
- Routing structure: /, /login, /books
- Environment management: Vercel + VITE_ prefixed vars

**Deferred Decisions (Post-MVP):**
- Caching strategy (TanStack Query) - if performance issues arise
- Error boundary patterns - basic try/catch sufficient for MVP

### Data Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | Supabase PostgreSQL | PRD requirement |
| Validation | Zod schemas | Type-safe, React Hook Form integration |
| Data access | Service layer (lib/books.ts) | Centralized, testable, maintainable |

**Data Flow:**
```
Component → Service Function → Supabase Client → PostgreSQL
                                      ↓
                              RLS (Row Level Security)
```

### Authentication & Security

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth provider | Supabase Auth | PRD requirement |
| Session management | AuthContext | Standard React pattern |
| Route protection | ProtectedRoute component | Declarative, reusable |
| Data isolation | RLS policies | Database-level security |

**Auth Flow:**
1. User visits app → AuthContext checks session
2. No session → Redirect to /login
3. Valid session → Access granted, user data available via useAuth()

### Frontend Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State management | useState + Context | Sufficient for app complexity |
| Form handling | React Hook Form + Zod | Performance, validation, Shadcn integration |
| Routing | React Router 7 | PRD requirement, SPA standard |
| Styling | Tailwind + Shadcn/ui | PRD requirement, rapid development |

**Component Organization:**
```
src/
├── components/
│   ├── ui/          # Shadcn/ui (generated)
│   ├── book/        # BookCard, BookForm, StatusBadge
│   ├── library/     # BookList, StatusFilter, EmptyLibrary
│   └── layout/      # Header, ProtectedRoute
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── supabase.ts  # Client initialization
│   ├── books.ts     # CRUD operations
│   └── utils.ts     # Shadcn utilities
├── pages/
│   ├── LoginPage.tsx
│   └── BooksPage.tsx
└── schemas/
    └── book.ts      # Zod schemas
```

### Infrastructure & Deployment

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Hosting | Vercel | PRD requirement, zero-config |
| CI/CD | Vercel Auto-Deploy | Simple, sufficient for project |
| Environments | Vercel Dashboard | Secure, easy management |

**Environment Variables:**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

### Decision Impact Analysis

**Implementation Sequence:**
1. Project initialization (Vite + dependencies)
2. Supabase setup (client, types, RLS)
3. Auth layer (AuthContext, ProtectedRoute)
4. Data layer (service functions)
5. UI components (Shadcn + custom)
6. Pages assembly
7. Vercel deployment

**Cross-Component Dependencies:**
- AuthContext must be initialized before ProtectedRoute
- Supabase client must exist before service functions
- Zod schemas shared between forms and services

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Addressed:** 8 areas standardized for AI agent consistency

### Naming Patterns

**Database Naming (Supabase PostgreSQL):**
- Tables: snake_case plural → `books`, `users`
- Columns: snake_case → `user_id`, `created_at`, `updated_at`
- Constraints: Follow Supabase defaults

**Code Naming (TypeScript/React):**

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `BookCard`, `StatusBadge` |
| Component files | PascalCase.tsx | `BookCard.tsx` |
| Functions | camelCase | `getBooks`, `handleSubmit` |
| Variables | camelCase | `userId`, `bookList` |
| Constants | UPPER_SNAKE_CASE | `MAX_BOOKS` |
| Types/Interfaces | PascalCase | `Book`, `BookFormData` |
| Utility files | kebab-case.ts | `supabase.ts`, `books.ts` |

### Structure Patterns

**File Organization:**
- One component per file
- Tests co-located: `ComponentName.test.tsx`
- Types in `src/types/`
- Custom hooks in `src/hooks/`
- Static assets in `public/`

**Component Organization:**
```
src/components/
├── ui/        # Shadcn/ui (generated, do not modify)
├── book/      # Book domain components
├── library/   # Library page components
└── layout/    # Layout components
```

### Format Patterns

**Data Types (match Supabase snake_case):**
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

**Service Function Pattern:**
```typescript
export async function getBooks(userId: string): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data ?? []
}
```

### Process Patterns

**Error Handling Pattern:**
```typescript
try {
  await serviceFunction(data)
  toast.success("Success message")
} catch (error) {
  toast.error("Error message")
  console.error(error)
}
```

**Loading State Pattern:**
```typescript
const [isLoading, setIsLoading] = useState(false)

async function handleAction() {
  setIsLoading(true)
  try {
    await action()
  } finally {
    setIsLoading(false)
  }
}
```

**State Naming Convention:**

| State Type | Naming | Example |
|------------|--------|---------|
| Loading | `isLoading`, `isSubmitting` | `isLoading` |
| Error | `error`, `fetchError` | `error` |
| Data | Descriptive noun | `books`, `user` |

**Toast Messages (French):**

| Action | Success | Error |
|--------|---------|-------|
| Add | "Livre ajouté" | "Erreur lors de l'ajout" |
| Update | "Livre modifié" | "Erreur lors de la modification" |
| Delete | "Livre supprimé" | "Erreur lors de la suppression" |
| Network | - | "Connexion impossible" |

**Optimistic UI Pattern:**
```typescript
// 1. Update local state immediately
setBooks(prev => prev.map(b => b.id === id ? {...b, status} : b))
// 2. Sync with server
await updateBookStatus(id, status)
// 3. Rollback on error if needed
```

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow naming conventions exactly as specified
- Use the service function pattern for all Supabase calls
- Implement error handling with try/catch + toast
- Use isLoading pattern for async operations
- Keep types matching Supabase snake_case columns

**Anti-Patterns to Avoid:**
- ❌ `UserID` or `user-id` in TypeScript (use `userId`)
- ❌ Converting snake_case to camelCase for types
- ❌ Inline Supabase calls in components
- ❌ Silent error swallowing (always log + toast)
- ❌ Multiple components in one file

## Project Structure & Boundaries

### Complete Project Directory Structure

```
ma-bibliotheque/
├── .env.local                    # Variables Supabase (local)
├── .env.example                  # Template des variables
├── .gitignore
├── README.md
├── index.html                    # Point d'entrée Vite
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── components.json               # Config Shadcn/ui
├── public/
│   └── favicon.ico
└── src/
    ├── main.tsx                  # Point d'entrée React
    ├── App.tsx                   # Routes + AuthProvider
    ├── index.css                 # Tailwind + CSS variables TweakCN
    ├── vite-env.d.ts
    │
    ├── components/
    │   ├── ui/                   # Shadcn/ui (généré)
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── input.tsx
    │   │   ├── select.tsx
    │   │   ├── dialog.tsx
    │   │   ├── sheet.tsx
    │   │   ├── badge.tsx
    │   │   ├── toggle-group.tsx
    │   │   ├── form.tsx
    │   │   ├── label.tsx
    │   │   ├── alert-dialog.tsx
    │   │   └── sonner.tsx
    │   │
    │   ├── book/                 # Composants métier livre
    │   │   ├── BookCard.tsx
    │   │   ├── BookCard.test.tsx
    │   │   ├── BookForm.tsx
    │   │   ├── BookForm.test.tsx
    │   │   ├── StatusBadge.tsx
    │   │   └── StatusBadge.test.tsx
    │   │
    │   ├── library/              # Composants page bibliothèque
    │   │   ├── BookList.tsx
    │   │   ├── BookList.test.tsx
    │   │   ├── StatusFilter.tsx
    │   │   ├── StatusFilter.test.tsx
    │   │   ├── EmptyLibrary.tsx
    │   │   └── EmptyLibrary.test.tsx
    │   │
    │   └── layout/               # Composants layout
    │       ├── Header.tsx
    │       ├── Header.test.tsx
    │       ├── ProtectedRoute.tsx
    │       └── ProtectedRoute.test.tsx
    │
    ├── contexts/
    │   └── AuthContext.tsx       # Provider + hook useAuth()
    │
    ├── hooks/
    │   └── useBooks.ts           # Hook custom gestion livres (optionnel)
    │
    ├── lib/
    │   ├── supabase.ts           # Client Supabase initialisé
    │   ├── books.ts              # CRUD books (getBooks, addBook, etc.)
    │   └── utils.ts              # cn() pour Shadcn/ui
    │
    ├── pages/
    │   ├── LoginPage.tsx         # Connexion / Inscription
    │   ├── LoginPage.test.tsx
    │   ├── BooksPage.tsx         # Liste des livres (page principale)
    │   └── BooksPage.test.tsx
    │
    ├── schemas/
    │   └── book.ts               # Schémas Zod (bookSchema, etc.)
    │
    └── types/
        ├── book.ts               # Interface Book
        ├── auth.ts               # Types AuthContext
        └── supabase.ts           # Types générés Supabase (optionnel)
```

### Architectural Boundaries

**API Boundary (Supabase):**
```
React Component
      ↓
  lib/books.ts (service layer)
      ↓
  lib/supabase.ts (client)
      ↓
  Supabase PostgreSQL + RLS
```

**Authentication Boundary:**
```
App.tsx (AuthProvider)
      ↓
  AuthContext.tsx (state + functions)
      ↓
  ProtectedRoute.tsx (guard)
      ↓
  Protected Pages (BooksPage)
```

**Component Boundary:**
```
Pages (orchestration)
  ↓
Components/library (page-specific)
  ↓
Components/book (reusable business)
  ↓
Components/ui (Shadcn primitives)
```

### Requirements to Structure Mapping

| Requirement | Files Impacted |
|-------------|----------------|
| FR-1.1 Create account | `LoginPage.tsx`, `AuthContext.tsx`, `lib/supabase.ts` |
| FR-1.2 Login | `LoginPage.tsx`, `AuthContext.tsx` |
| FR-1.3 Logout | `Header.tsx`, `AuthContext.tsx` |
| FR-1.4 Data isolation | `lib/books.ts` (user_id filter), Supabase RLS |
| FR-2.1 List books | `BooksPage.tsx`, `BookList.tsx`, `lib/books.ts` |
| FR-2.2 Add book | `BookForm.tsx`, `lib/books.ts`, `schemas/book.ts` |
| FR-2.3 Edit book | `BookForm.tsx`, `lib/books.ts` |
| FR-2.4 Delete book | `BookCard.tsx`, `lib/books.ts` |
| FR-2.5 Filter by status | `StatusFilter.tsx`, `BooksPage.tsx` (local state) |
| FR-3.1-3 Statuses | `StatusBadge.tsx`, `StatusFilter.tsx`, `schemas/book.ts` |

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        BooksPage                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │StatusFilter │  │  BookList   │  │     BookForm        │  │
│  │             │  │             │  │  (Dialog/Sheet)     │  │
│  │ filter state│  │ ┌─────────┐ │  │                     │  │
│  │      ↓      │  │ │BookCard │ │  │ Zod validation      │  │
│  │   setFilter │  │ │ + Badge │ │  │       ↓             │  │
│  └─────────────┘  │ └─────────┘ │  │ addBook/updateBook  │  │
│         ↓         └─────────────┘  └─────────────────────┘  │
│    filteredBooks                              ↓              │
│         ↑                              lib/books.ts          │
│         └──────────────────────────────────────┘             │
│                            ↓                                 │
│                     lib/supabase.ts                          │
│                            ↓                                 │
│                   Supabase PostgreSQL                        │
└─────────────────────────────────────────────────────────────┘
```

### File Organization Patterns

**Configuration Files:**
- Root level: Vite, TypeScript, Tailwind configs
- `.env.local` for secrets (gitignored)
- `.env.example` as template (committed)
- `components.json` for Shadcn/ui CLI

**Source Organization:**
- Feature-based component folders (`book/`, `library/`)
- Shared utilities in `lib/`
- Types separated by domain in `types/`
- Validation schemas in `schemas/`

**Test Organization:**
- Co-located with source files (`*.test.tsx`)
- Same naming convention as component

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices work together without conflicts:
- React 18 + Vite 6: Native support
- Shadcn/ui + Tailwind CSS v4: Designed together
- React Hook Form + Zod: Native integration
- Supabase Auth + RLS: Core Supabase feature
- TypeScript: Full support across all packages

**Pattern Consistency:**
- Naming conventions consistent across database (snake_case) and code (camelCase/PascalCase)
- Structure patterns align with React + Vite conventions
- Communication patterns coherent (service layer → Supabase)

**Structure Alignment:**
- Project structure supports all architectural decisions
- Boundaries properly defined (API, Auth, Components)
- Integration points clearly specified

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**

| FR Category | Requirements | Coverage |
|-------------|--------------|----------|
| FR-1 Authentication | 4 FRs | 100% ✅ |
| FR-2 Book Management | 5 FRs | 100% ✅ |
| FR-3 Reading Statuses | 3 FRs | 100% ✅ |

**Non-Functional Requirements Coverage:**
- Performance: ✅ Vite optimized builds, Vercel CDN
- Security: ✅ Supabase Auth + RLS policies
- Availability: ✅ Vercel managed hosting (99.9%)
- Compatibility: ✅ Responsive structure defined

### Implementation Readiness Validation ✅

**Decision Completeness:**
- ✅ All critical decisions documented
- ✅ Technology versions specified
- ✅ Implementation patterns with examples
- ✅ Consistency rules clearly defined

**Structure Completeness:**
- ✅ Complete directory structure (40+ files defined)
- ✅ All components specified
- ✅ Integration points mapped
- ✅ Requirements to files mapping complete

**Pattern Completeness:**
- ✅ Naming conventions for all code types
- ✅ Service layer pattern with examples
- ✅ Error handling pattern standardized
- ✅ Loading state pattern defined

### Gap Analysis Results

**Critical Gaps:** None identified
**Important Gaps:** None identified
**Post-MVP Enhancements:**
- E2E testing with Playwright
- React Error Boundaries
- TanStack Query for advanced caching

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Low)
- [x] Technical constraints identified (No Edge Functions, No Storage, No Realtime)
- [x] Cross-cutting concerns mapped (Auth, State, Errors, Responsive)

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined (Service layer)
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established (8 categories)
- [x] Structure patterns defined (feature-based)
- [x] Communication patterns specified (Supabase client)
- [x] Process patterns documented (loading, errors, toast)

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION ✅

**Confidence Level:** HIGH

**Key Strengths:**
- Simple, focused architecture aligned with "radical simplicity" philosophy
- Complete requirements coverage with clear file mapping
- Consistent patterns that AI agents can follow
- No over-engineering - appropriate for project complexity

**Areas for Future Enhancement:**
- Add TanStack Query if performance issues arise
- Implement E2E tests after MVP validation
- Consider React Error Boundaries for production

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**
```bash
npm create vite@latest ma-bibliotheque -- --template react-ts
```

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2025-12-17
**Document Location:** docs/architecture.md

### Final Architecture Deliverables

**📋 Complete Architecture Document**
- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**
- 15+ architectural decisions made
- 8 implementation patterns defined
- 40+ files and components specified
- 12 functional requirements fully supported

**📚 AI Agent Implementation Guide**
- Technology stack with verified versions
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Integration patterns and communication standards

### Development Sequence

1. Initialize project using documented starter template
2. Set up Supabase project and configure RLS
3. Install dependencies (Shadcn/ui, React Router, React Hook Form, Zod)
4. Implement AuthContext and authentication flow
5. Build service layer (lib/books.ts)
6. Create UI components following patterns
7. Deploy to Vercel

### Quality Assurance Checklist

**✅ Architecture Coherence**
- [x] All decisions work together without conflicts
- [x] Technology choices are compatible
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**✅ Requirements Coverage**
- [x] All functional requirements are supported
- [x] All non-functional requirements are addressed
- [x] Cross-cutting concerns are handled
- [x] Integration points are defined

**✅ Implementation Readiness**
- [x] Decisions are specific and actionable
- [x] Patterns prevent agent conflicts
- [x] Structure is complete and unambiguous
- [x] Examples are provided for clarity

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.
