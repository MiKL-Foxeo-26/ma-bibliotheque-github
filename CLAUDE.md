# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Project Name:** Ma Bibliothèque
**Description:** Application web personnelle de gestion de collection de livres et suivi de lectures.
**Philosophy:** Simplicité radicale - pas d'API externes, pas d'images, pas de social. Juste l'essentiel.

### Current Status

**Phase:** 4 - Implementation (READY)
**Readiness:** Validated on 2025-12-18
**Report:** `docs/implementation-readiness-report-2025-12-18.md`

### Planning Documents

| Document | Location | Status |
|----------|----------|--------|
| PRD | `docs/prd/` (sharded) | Complete |
| Architecture | `docs/architecture.md` | Complete |
| Epics & Stories | `docs/epics.md` | Complete |
| UX Design | `docs/ux-design-specification.md` | Complete |

This is a **BMAD Method v6** installation - an AI-driven agile development framework that uses specialized agents and workflows to guide software development through four phases:

- **Phase 1 (Analysis)**: Brainstorming, research, product briefs
- **Phase 2 (Planning)**: PRD/tech-spec creation, UX design
- **Phase 3 (Solutioning)**: Architecture design, epics/stories creation
- **Phase 4 (Implementation)**: Sprint planning, story development, code review (CURRENT)

## Configuration

- **User**: MiKL
- **Communication Language**: French
- **Document Output**: French
- **Output Folder**: `docs/`
- **Agent Memory**: `.bmad-user-memory/`

## Tech Stack

- **Frontend**: React 18 + Vite 5.x
- **Routing**: React Router 7.x
- **UI Components**: Shadcn/ui + TweakCN
- **Backend**: Supabase (auth + database uniquement)
- **Deployment**: Vercel

**Contraintes Supabase:**
- Pas d'Edge Functions
- Pas de Storage (images)
- Pas de Realtime

## Functional Requirements (12 FRs)

### FR-1: Authentification
- FR-1.1: Créer un compte avec email/mot de passe
- FR-1.2: Se connecter à son compte
- FR-1.3: Se déconnecter
- FR-1.4: Données isolées par utilisateur (RLS)

### FR-2: Gestion des livres
- FR-2.1: Voir la liste de tous mes livres
- FR-2.2: Ajouter un livre (titre, auteur, statut)
- FR-2.3: Modifier les informations d'un livre
- FR-2.4: Supprimer un livre
- FR-2.5: Filtrer les livres par statut

### FR-3: Statuts de lecture
- FR-3.1: Statut "À lire" disponible
- FR-3.2: Statut "En cours" disponible
- FR-3.3: Statut "Lu" disponible

## Epics & Stories (12 stories)

### Epic 1: Fondation et Authentification (5 stories)
| Story | Description | FRs |
|-------|-------------|-----|
| 1.1 | Initialisation du projet | - |
| 1.2 | Configuration Supabase et schéma BD | FR-1.4 |
| 1.3 | Contexte d'authentification | - |
| 1.4 | Page de connexion avec inscription | FR-1.1, FR-1.2 |
| 1.5 | Routes protégées et déconnexion | FR-1.3 |

### Epic 2: Gestion de la Bibliothèque (7 stories)
| Story | Description | FRs |
|-------|-------------|-----|
| 2.1 | Service layer et types | - |
| 2.2 | Page bibliothèque et liste | FR-2.1 |
| 2.3 | BookCard avec StatusBadge | FR-3.1, FR-3.2, FR-3.3 |
| 2.4 | Ajout de livre | FR-2.2 |
| 2.5 | Modification de livre | FR-2.3 |
| 2.6 | Suppression avec confirmation | FR-2.4 |
| 2.7 | Filtrage par statut | FR-2.5 |

## Project Structure

```
ma-bibliotheque/
├── .env.local                    # Variables Supabase (gitignored)
├── .env.example                  # Template des variables
├── index.html
├── package.json
├── vite.config.ts
├── components.json               # Config Shadcn/ui
└── src/
    ├── main.tsx
    ├── App.tsx                   # Routes + AuthProvider
    ├── index.css                 # Tailwind + CSS variables TweakCN
    ├── components/
    │   ├── ui/                   # Shadcn/ui (généré)
    │   ├── book/                 # BookCard, BookForm, StatusBadge
    │   ├── library/              # BookList, StatusFilter, EmptyLibrary
    │   └── layout/               # Header, ProtectedRoute
    ├── contexts/
    │   └── AuthContext.tsx
    ├── lib/
    │   ├── supabase.ts           # Client Supabase
    │   ├── books.ts              # CRUD operations
    │   └── utils.ts              # cn() pour Shadcn/ui
    ├── pages/
    │   ├── LoginPage.tsx
    │   └── BooksPage.tsx
    ├── schemas/
    │   └── book.ts               # Zod schemas
    └── types/
        ├── book.ts
        └── auth.ts
```

## Implementation Patterns

### Data Types (match Supabase snake_case)
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

### Service Function Pattern
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

### Error Handling Pattern
```typescript
try {
  await serviceFunction(data)
  toast.success("Livre ajouté")
} catch (error) {
  toast.error("Erreur lors de l'ajout")
  console.error(error)
}
```

### Toast Messages (French)
| Action | Success | Error |
|--------|---------|-------|
| Add | "Livre ajouté" | "Erreur lors de l'ajout" |
| Update | "Livre modifié" | "Erreur lors de la modification" |
| Delete | "Livre supprimé" | "Erreur lors de la suppression" |

### Status Badge Colors
| Statut | Label | Token CSS |
|--------|-------|-----------|
| to_read | À lire | `--muted` |
| reading | En cours | `--secondary` |
| read | Lu | `--primary` |

## Database Schema

```sql
CREATE TABLE books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  author text NOT NULL,
  status text NOT NULL CHECK (status IN ('to_read', 'reading', 'read')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS Policy
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own books"
ON books FOR ALL
USING (auth.uid() = user_id);
```

## Responsive Breakpoints

| Device | Breakpoint | Layout |
|--------|------------|--------|
| Mobile | < 640px | 1 colonne, FAB, Sheet |
| Tablet | 640-1024px | 2 colonnes, Dialog |
| Desktop | > 1024px | 3-4 colonnes, Hover actions |

## Shadcn/ui Components

Utiliser le MCP shadcn pour accéder aux composants. Composants recommandés pour ce projet:

| Usage | Composants |
|-------|------------|
| Auth (Login/Register) | `card`, `input`, `button`, `form`, `label` |
| Liste des livres | `card`, `badge` (statuts), `empty` (liste vide) |
| Filtres par statut | `toggle-group` ou `tabs` |
| Ajout/Édition livre | `dialog` ou `sheet`, `input`, `select`, `form` |
| Feedback | `sonner` (toasts), `alert-dialog` (suppression) |
| Responsive | `drawer` (mobile), `dialog` (desktop) |

## Design System

**Typography:**
- Sans (principal): `Merriweather, serif`
- Serif: `Source Serif 4, serif`
- Mono: `JetBrains Mono, monospace`

**Border Radius:** `0.425rem`
**Spacing:** `0.25rem`

**CSS Variables (à intégrer dans le projet):**

```css
:root {
  --background: oklch(0.9429 0.0165 91.5550);
  --foreground: oklch(0.4265 0.0310 59.2153);
  --card: oklch(0.8934 0.0367 87.7985);
  --card-foreground: oklch(0.4265 0.0310 59.2153);
  --popover: oklch(0.9378 0.0331 89.8515);
  --popover-foreground: oklch(0.4265 0.0310 59.2153);
  --primary: oklch(0.6011 0.0882 118.7028);
  --primary-foreground: oklch(0.9882 0.0069 88.6415);
  --secondary: oklch(0.8493 0.0775 90.1635);
  --secondary-foreground: oklch(0.4265 0.0310 59.2153);
  --muted: oklch(0.8532 0.0631 91.1493);
  --muted-foreground: oklch(0.5761 0.0259 60.9323);
  --accent: oklch(0.8445 0.0709 91.2178);
  --accent-foreground: oklch(0.4265 0.0310 59.2153);
  --destructive: oklch(0.7136 0.0981 29.9827);
  --destructive-foreground: oklch(0.9790 0.0082 91.4818);
  --border: oklch(0.6918 0.0440 59.8448);
  --input: oklch(0.8361 0.0713 90.3269);
  --ring: oklch(0.7350 0.0564 130.8494);
  --chart-1: oklch(0.7350 0.0564 130.8494);
  --chart-2: oklch(0.6762 0.0567 132.4479);
  --chart-3: oklch(0.8185 0.0332 136.6539);
  --chart-4: oklch(0.5929 0.0464 137.6224);
  --chart-5: oklch(0.5183 0.0390 137.1892);
  --sidebar: oklch(0.8631 0.0645 90.5161);
  --sidebar-foreground: oklch(0.4265 0.0310 59.2153);
  --sidebar-primary: oklch(0.7350 0.0564 130.8494);
  --sidebar-primary-foreground: oklch(0.9882 0.0069 88.6415);
  --sidebar-accent: oklch(0.9225 0.0169 88.0027);
  --sidebar-accent-foreground: oklch(0.4265 0.0310 59.2153);
  --sidebar-border: oklch(0.9073 0.0170 88.0044);
  --sidebar-ring: oklch(0.7350 0.0564 130.8494);
  --font-sans: Merriweather, serif;
  --font-serif: Source Serif 4, serif;
  --font-mono: JetBrains Mono, monospace;
  --radius: 0.425rem;
  --shadow-x: 3px;
  --shadow-y: 3px;
  --shadow-blur: 2px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.15;
  --shadow-color: hsl(88 22% 35% / 0.15);
  --shadow-2xs: 3px 3px 2px 0px hsl(88 22% 35% / 0.07);
  --shadow-xs: 3px 3px 2px 0px hsl(88 22% 35% / 0.07);
  --shadow-sm: 3px 3px 2px 0px hsl(88 22% 35% / 0.15), 3px 1px 2px -1px hsl(88 22% 35% / 0.15);
  --shadow: 3px 3px 2px 0px hsl(88 22% 35% / 0.15), 3px 1px 2px -1px hsl(88 22% 35% / 0.15);
  --shadow-md: 3px 3px 2px 0px hsl(88 22% 35% / 0.15), 3px 2px 4px -1px hsl(88 22% 35% / 0.15);
  --shadow-lg: 3px 3px 2px 0px hsl(88 22% 35% / 0.15), 3px 4px 6px -1px hsl(88 22% 35% / 0.15);
  --shadow-xl: 3px 3px 2px 0px hsl(88 22% 35% / 0.15), 3px 8px 10px -1px hsl(88 22% 35% / 0.15);
  --shadow-2xl: 3px 3px 2px 0px hsl(88 22% 35% / 0.38);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
}

.dark {
  --background: oklch(0.3303 0.0214 88.0737);
  --foreground: oklch(0.9217 0.0235 82.1191);
  --card: oklch(0.3583 0.0165 82.3257);
  --card-foreground: oklch(0.9217 0.0235 82.1191);
  --popover: oklch(0.3583 0.0165 82.3257);
  --popover-foreground: oklch(0.9217 0.0235 82.1191);
  --primary: oklch(0.6762 0.0567 132.4479);
  --primary-foreground: oklch(0.2686 0.0105 61.0213);
  --secondary: oklch(0.4448 0.0239 84.5498);
  --secondary-foreground: oklch(0.9217 0.0235 82.1191);
  --muted: oklch(0.3892 0.0197 82.7084);
  --muted-foreground: oklch(0.7096 0.0171 73.6179);
  --accent: oklch(0.6540 0.0723 90.7629);
  --accent-foreground: oklch(0.2686 0.0105 61.0213);
  --destructive: oklch(0.6287 0.0821 31.2958);
  --destructive-foreground: oklch(0.9357 0.0201 84.5907);
  --border: oklch(0.4448 0.0239 84.5498);
  --input: oklch(0.4448 0.0239 84.5498);
  --ring: oklch(0.6762 0.0567 132.4479);
  --chart-1: oklch(0.6762 0.0567 132.4479);
  --chart-2: oklch(0.7350 0.0564 130.8494);
  --chart-3: oklch(0.5929 0.0464 137.6224);
  --chart-4: oklch(0.6540 0.0723 90.7629);
  --chart-5: oklch(0.5183 0.0390 137.1892);
  --sidebar: oklch(0.3303 0.0214 88.0737);
  --sidebar-foreground: oklch(0.9217 0.0235 82.1191);
  --sidebar-primary: oklch(0.6762 0.0567 132.4479);
  --sidebar-primary-foreground: oklch(0.2686 0.0105 61.0213);
  --sidebar-accent: oklch(0.6540 0.0723 90.7629);
  --sidebar-accent-foreground: oklch(0.2686 0.0105 61.0213);
  --sidebar-border: oklch(0.4448 0.0239 84.5498);
  --sidebar-ring: oklch(0.6762 0.0567 132.4479);
  --font-sans: Merriweather, serif;
  --font-serif: Source Serif 4, serif;
  --font-mono: JetBrains Mono, monospace;
  --radius: 0.425rem;
  --shadow-x: 3px;
  --shadow-y: 3px;
  --shadow-blur: 2px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.15;
  --shadow-color: hsl(88 22% 35% / 0.15);
  --shadow-2xs: 3px 3px 2px 0px hsl(88 22% 35% / 0.07);
  --shadow-xs: 3px 3px 2px 0px hsl(88 22% 35% / 0.07);
  --shadow-sm: 3px 3px 2px 0px hsl(88 22% 35% / 0.15), 3px 1px 2px -1px hsl(88 22% 35% / 0.15);
  --shadow: 3px 3px 2px 0px hsl(88 22% 35% / 0.15), 3px 1px 2px -1px hsl(88 22% 35% / 0.15);
  --shadow-md: 3px 3px 2px 0px hsl(88 22% 35% / 0.15), 3px 2px 4px -1px hsl(88 22% 35% / 0.15);
  --shadow-lg: 3px 3px 2px 0px hsl(88 22% 35% / 0.15), 3px 4px 6px -1px hsl(88 22% 35% / 0.15);
  --shadow-xl: 3px 3px 2px 0px hsl(88 22% 35% / 0.15), 3px 8px 10px -1px hsl(88 22% 35% / 0.15);
  --shadow-2xl: 3px 3px 2px 0px hsl(88 22% 35% / 0.38);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}
```

## Available Slash Commands

BMAD workflows are exposed as Claude Code slash commands under `/bmad:`. Key commands:

### Workflow Management
- `/bmad:bmm:workflows:workflow-init` - Initialize a new project, choose planning track
- `/bmad:bmm:workflows:workflow-status` - Check current status, get next recommended workflow

### Analysis Phase (Phase 1)
- `/bmad:bmm:workflows:create-product-brief` - Define product vision and strategy
- `/bmad:bmm:workflows:research` - Conduct market/technical/domain research

### Planning Phase (Phase 2)
- `/bmad:bmm:workflows:create-prd` - Create Product Requirements Document
- `/bmad:bmm:workflows:create-tech-spec` - Quick spec for smaller projects
- `/bmad:bmm:workflows:create-ux-design` - UX design workshop

### Solutioning Phase (Phase 3)
- `/bmad:bmm:workflows:create-architecture` - Design system architecture
- `/bmad:bmm:workflows:create-epics-stories` - Break PRD into implementable stories
- `/bmad:bmm:workflows:check-implementation-readiness` - Validate before implementation

### Implementation Phase (Phase 4)
- `/bmad:bmm:workflows:sprint-planning` - Initialize sprint tracking
- `/bmad:bmm:workflows:create-story` - Draft next story from epic
- `/bmad:bmm:workflows:dev-story` - Implement a story with tests
- `/bmad:bmm:workflows:code-review` - Adversarial code review
- `/bmad:bmm:workflows:retrospective` - Post-epic review

### Testing (TEA Agent)
- `/bmad:bmm:workflows:testarch-framework` - Initialize test framework
- `/bmad:bmm:workflows:testarch-atdd` - Generate acceptance tests first
- `/bmad:bmm:workflows:testarch-automate` - Expand test coverage
- `/bmad:bmm:workflows:testarch-ci` - Setup CI/CD pipeline

### Quick Flow (Fast Track)
- `/bmad:bmm:workflows:quick-dev` - Rapid development from spec or instructions

### Multi-Agent
- `/bmad:core:workflows:party-mode` - Multi-agent collaborative discussion
- `/bmad:core:workflows:brainstorming-session` - Creative brainstorming with techniques

## Three Planning Tracks

Projects are categorized into tracks based on complexity:

1. **Quick Flow**: Tech-spec only, for bug fixes and simple features (1-15 stories typically)
2. **BMad Method**: PRD + Architecture + UX, for products and complex features (10-50+ stories)
3. **Enterprise Method**: Extended planning with security/devops/test for compliance needs (30+ stories)

## Agent Roster

**Core Development**: PM (John), Analyst (Mary), Architect (Winston), SM (Bob), DEV (Amelia), TEA (Murat), UX Designer (Sally), Technical Writer (Paige), Principal Engineer (Jordan)

**Orchestration**: BMad Master

## Key File Locations

- **Agents**: `.bmad/bmm/agents/`
- **Workflows**: `.bmad/bmm/workflows/`
- **Configuration**: `.bmad/core/config.yaml`
- **Agent Customizations**: `.bmad/_cfg/agents/`
- **Test Knowledge Base**: `.bmad/bmm/testarch/knowledge/`
- **Workflow Status Template**: `.bmad/bmm/workflows/workflow-status/workflow-status-template.yaml`
- **Sprint Status Template**: `.bmad/bmm/workflows/4-implementation/sprint-planning/sprint-status-template.yaml`

## Workflow Best Practices

1. **Fresh chats for each workflow** - Prevents context pollution and hallucinations
2. **Check status when unsure** - Run `workflow-status` from any agent to get next steps
3. **Brownfield projects** - Always run `document-project` before planning workflows
4. **Use validation workflows** - `check-implementation-readiness` before Phase 4 transition

## Tracking Files (Auto-Generated)

- `docs/bmm-workflow-status.yaml` - Tracks phase progress
- `docs/sprint-status.yaml` - Tracks epics/stories during implementation

These files are managed by workflows - manual editing is not required.
