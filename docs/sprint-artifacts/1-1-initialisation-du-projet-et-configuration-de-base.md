# Story 1.1: Initialisation du projet et configuration de base

**Status:** Ready for Review
**Story Points:** 3
**Priority:** P0 - Critique (bloque tout le reste)

---

## Story

As a **developpeur**,
I want **un projet React configure avec les outils du stack technique**,
So that **je puisse commencer le developpement de l'application**.

---

## Acceptance Criteria

### AC1: Creation du projet React 18 + TypeScript

**Given** un environnement de developpement vierge
**When** j'execute la commande d'initialisation Vite
**Then** un projet React 18 + TypeScript est cree
**And** le projet utilise ESM modules
**And** TypeScript 5.x est configure en mode strict

### AC2: Structure de dossiers conforme a l'Architecture

**Given** le projet initialise
**When** la structure de dossiers est creee
**Then** elle suit exactement le pattern defini dans l'architecture :

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
    ├── App.tsx
    ├── index.css                 # Tailwind + CSS variables TweakCN
    ├── components/
    │   ├── ui/                   # Shadcn/ui (genere)
    │   ├── book/                 # BookCard, BookForm, StatusBadge
    │   ├── library/              # BookList, StatusFilter, EmptyLibrary
    │   └── layout/               # Header, ProtectedRoute
    ├── contexts/
    ├── lib/
    │   └── utils.ts              # cn() pour Shadcn/ui
    ├── pages/
    ├── schemas/
    └── types/
```

### AC3: Installation et configuration Tailwind CSS v4 + Shadcn/ui

**Given** le projet avec la structure creee
**When** j'installe Tailwind CSS et Shadcn/ui
**Then** Tailwind CSS v4 est configure via Vite plugin
**And** Shadcn/ui est initialise avec components.json
**And** la fonction `cn()` est disponible dans `lib/utils.ts`

### AC4: CSS variables du design system TweakCN integrees

**Given** Tailwind et Shadcn/ui configures
**When** je configure le theme dans `index.css`
**Then** toutes les CSS variables du design system sont presentes :
- Palette : `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--destructive`, etc.
- Typographie : `--font-sans` (Merriweather), `--font-serif` (Source Serif 4), `--font-mono` (JetBrains Mono)
- Spacing : `--radius: 0.425rem`, `--spacing: 0.25rem`
- Shadows : `--shadow-*` avec ombre directionnelle 3px 3px

### AC5: Support mode clair/sombre

**Given** les CSS variables configurees
**When** le theme est applique
**Then** le mode clair utilise les variables `:root`
**And** le mode sombre utilise les variables `.dark`
**And** le switch de theme fonctionne via la class strategy de Tailwind

### AC6: Application demarre sans erreur

**Given** le projet completement configure
**When** je lance `npm run dev`
**Then** l'application demarre sur http://localhost:5173
**And** aucune erreur dans la console
**And** aucun warning TypeScript

### AC7: Hot Module Replacement fonctionnel

**Given** l'application demarree
**When** je modifie un fichier source
**Then** les changements sont refletes instantanement
**And** l'etat React est preserve quand possible

---

## Tasks / Subtasks

- [x] **Task 1: Initialisation du projet Vite** (AC: 1)
  - [x] 1.1 Executer `npm create vite@latest ma-bibliotheque -- --template react-ts`
  - [x] 1.2 Entrer dans le dossier et executer `npm install`
  - [x] 1.3 Verifier que TypeScript est en mode strict (`tsconfig.json`)

- [x] **Task 2: Creation de la structure de dossiers** (AC: 2)
  - [x] 2.1 Creer `src/components/ui/` (vide, pour Shadcn)
  - [x] 2.2 Creer `src/components/book/` (vide)
  - [x] 2.3 Creer `src/components/library/` (vide)
  - [x] 2.4 Creer `src/components/layout/` (vide)
  - [x] 2.5 Creer `src/contexts/` (vide)
  - [x] 2.6 Creer `src/lib/` (vide)
  - [x] 2.7 Creer `src/pages/` (vide)
  - [x] 2.8 Creer `src/schemas/` (vide)
  - [x] 2.9 Creer `src/types/` (vide)
  - [x] 2.10 Creer `src/hooks/` (vide)
  - [x] 2.11 Creer `.env.example` avec template variables

- [x] **Task 3: Installation et configuration Tailwind CSS v4** (AC: 3)
  - [x] 3.1 Installer `@tailwindcss/vite` et `tailwindcss`
  - [x] 3.2 Configurer le plugin dans `vite.config.ts`
  - [x] 3.3 Configurer `index.css` avec les directives Tailwind v4

- [x] **Task 4: Installation et configuration Shadcn/ui** (AC: 3)
  - [x] 4.1 Executer `npx shadcn@latest init`
  - [x] 4.2 Configurer `components.json` (style: default, baseColor: neutral, css variables: true)
  - [x] 4.3 Creer `src/lib/utils.ts` avec la fonction `cn()`
  - [x] 4.4 Configurer les path aliases dans `tsconfig.json` (`@/*` -> `./src/*`)

- [x] **Task 5: Integration du design system TweakCN** (AC: 4, 5)
  - [x] 5.1 Ajouter les Google Fonts dans `index.html` (Merriweather, Source Serif 4, JetBrains Mono)
  - [x] 5.2 Copier les CSS variables light mode dans `:root`
  - [x] 5.3 Copier les CSS variables dark mode dans `.dark`
  - [x] 5.4 Ajouter le block `@theme inline` pour Tailwind v4
  - [x] 5.5 Verifier les shadows directionnelles

- [x] **Task 6: Configuration finale et verification** (AC: 6, 7)
  - [x] 6.1 Nettoyer `App.tsx` (supprimer le contenu demo Vite)
  - [x] 6.2 Ajouter un composant minimal de test affichant le theme
  - [x] 6.3 Executer `npm run dev` et verifier le demarrage
  - [x] 6.4 Tester le hot reload en modifiant un fichier
  - [x] 6.5 Verifier l'absence d'erreurs console et TypeScript

---

## Dev Notes

### Commandes d'initialisation

```bash
# Step 1: Creer le projet
npm create vite@latest ma-bibliotheque -- --template react-ts

# Step 2: Entrer et installer
cd ma-bibliotheque
npm install

# Step 3: Installer Tailwind v4
npm install -D tailwindcss @tailwindcss/vite

# Step 4: Installer les dependances Shadcn/ui
npm install clsx tailwind-merge class-variance-authority lucide-react

# Step 5: Initialiser Shadcn/ui
npx shadcn@latest init
```

### Configuration vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Configuration tsconfig.json (path aliases)

Ajouter dans `compilerOptions`:
```json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

### Fichier src/lib/utils.ts

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Fichier .env.example

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### CSS Variables TweakCN completes

Les CSS variables completes sont disponibles dans le CLAUDE.md du projet.
Copier integralement les blocs `:root` et `.dark` et le block `@theme inline`.

### Polices Google Fonts

Ajouter dans `<head>` de `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
```

---

## Project Structure Notes

### Alignement avec l'Architecture

Cette story etablit la fondation exacte definie dans `docs/architecture.md` section "Project Structure & Boundaries".

**Points critiques:**
- Les dossiers sont crees vides pour preparer les stories suivantes
- La structure respecte le pattern "feature-based" (book/, library/, layout/)
- Les path aliases `@/` sont obligatoires pour Shadcn/ui

### Conventions de nommage

| Element | Convention | Exemple |
|---------|------------|---------|
| Composants | PascalCase | `BookCard.tsx` |
| Fichiers utilitaires | kebab-case | `utils.ts` |
| CSS variables | kebab-case | `--primary-foreground` |

---

## Technical Requirements from Architecture

### Stack technique obligatoire

- **React 18.x** avec concurrent mode support
- **TypeScript 5.x** en mode strict
- **Vite 6.x** avec ESBuild (dev) et Rollup (prod)
- **Tailwind CSS v4** via plugin Vite
- **Shadcn/ui** avec ownership total du code

### Configuration TypeScript stricte

Le fichier `tsconfig.json` doit avoir:
- `"strict": true`
- `"noUnusedLocals": true`
- `"noUnusedParameters": true`

### Arborescence des fichiers de config

```
ma-bibliotheque/
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── components.json         # Shadcn/ui CLI config
└── .env.example
```

---

## Architecture Compliance Checklist

- [x] TypeScript strict mode active
- [x] Path aliases `@/*` configures
- [x] Tailwind v4 via plugin Vite (pas de config PostCSS)
- [x] Structure de dossiers exactement conforme
- [x] CSS variables TweakCN completes (light + dark)
- [x] Google Fonts charges (Merriweather, Source Serif 4, JetBrains Mono)
- [x] Fonction `cn()` disponible dans `lib/utils.ts`
- [x] `.env.example` documente les variables requises

---

## Testing Requirements

### Tests manuels obligatoires

1. **Demarrage**: `npm run dev` demarre sans erreur
2. **Hot Reload**: Modifier `App.tsx`, verifier le refresh instantane
3. **TypeScript**: `npm run build` compile sans erreur ni warning
4. **Theme**: Les couleurs du design system s'affichent correctement
5. **Dark Mode**: Ajouter class `dark` sur `<html>` et verifier le switch

### Verification de la structure

```bash
# Verifier que tous les dossiers existent
ls -la src/components/
ls -la src/contexts/
ls -la src/lib/
ls -la src/pages/
ls -la src/schemas/
ls -la src/types/
```

---

## References

- [Source: docs/architecture.md#Starter Template Evaluation]
- [Source: docs/architecture.md#Project Structure & Boundaries]
- [Source: docs/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: docs/ux-design-specification.md#Design System Foundation]
- [Source: docs/epics.md#Story 1.1]
- [Source: CLAUDE.md#Design System CSS Variables]

---

## Dev Agent Record

### Context Reference

Story context generated by SM agent (Bob) on 2025-12-18.
Complete architecture and UX documents analyzed.

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes List

Implementation completed on 2025-12-18 by Dev Agent (Amelia).

**Summary:**
- Projet React 18 + TypeScript cree avec Vite 7.3.0
- Structure de dossiers conforme a l'architecture specifiee
- Tailwind CSS v4 configure via plugin Vite (@tailwindcss/vite)
- Shadcn/ui configure avec components.json et fonction cn()
- Design system TweakCN integre (CSS variables light/dark, shadows directionnelles)
- Google Fonts charges (Merriweather, Source Serif 4, JetBrains Mono)
- Path aliases @/* configures dans tsconfig.json et tsconfig.app.json
- Build TypeScript reussit sans erreur ni warning
- Serveur de developpement demarre sur http://localhost:5173

**Verifications effectuees:**
- `npm run build` - Success, aucune erreur TypeScript
- `npm run dev` - Serveur demarre correctement
- Structure de dossiers verifiee conforme

### File List

**New Files:**
- `ma-bibliotheque/.env.example`
- `ma-bibliotheque/components.json`
- `ma-bibliotheque/index.html`
- `ma-bibliotheque/package.json`
- `ma-bibliotheque/tsconfig.json`
- `ma-bibliotheque/tsconfig.app.json`
- `ma-bibliotheque/tsconfig.node.json`
- `ma-bibliotheque/vite.config.ts`
- `ma-bibliotheque/src/main.tsx`
- `ma-bibliotheque/src/App.tsx`
- `ma-bibliotheque/src/index.css`
- `ma-bibliotheque/src/vite-env.d.ts`
- `ma-bibliotheque/src/lib/utils.ts`
- `ma-bibliotheque/src/components/ui/.gitkeep`
- `ma-bibliotheque/src/components/book/.gitkeep`
- `ma-bibliotheque/src/components/library/.gitkeep`
- `ma-bibliotheque/src/components/layout/.gitkeep`
- `ma-bibliotheque/src/contexts/.gitkeep`
- `ma-bibliotheque/src/pages/.gitkeep`
- `ma-bibliotheque/src/schemas/.gitkeep`
- `ma-bibliotheque/src/types/.gitkeep`
- `ma-bibliotheque/src/hooks/.gitkeep`

### Change Log

- 2025-12-18: Story 1.1 implemented - Project initialization and base configuration complete

---

## Story Ready Checklist

- [x] User story statement complete
- [x] Acceptance criteria detailles avec Given/When/Then
- [x] Tasks decomposees en subtasks actionnables
- [x] Dev notes avec exemples de code
- [x] Architecture compliance verifiee
- [x] References aux documents sources
- [x] Testing requirements definis

**Status: READY FOR DEVELOPMENT**
