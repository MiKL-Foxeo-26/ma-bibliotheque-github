# Story 1.4: Page de connexion avec inscription et connexion

**Status:** Ready for Review
**Story Points:** 5
**Priority:** P0 - Critique (FR-1.1, FR-1.2)
**Type:** Vertical Slice (UI + Logic + Data)

---

## Story

As a **utilisateur**,
I want **pouvoir creer un compte et me connecter**,
So that **j'accede a ma bibliotheque personnelle**.

---

## Vertical Slice Overview

Cette story est une **tranche verticale complete** qui inclut :

| Couche | Composants |
|--------|------------|
| **UI** | LoginPage, formulaires inscription/connexion, validation visuelle |
| **Logic** | Gestion d'etat formulaire, validation Zod, switch mode |
| **Data** | Integration AuthContext (signUp, signIn) |
| **Feedback** | Toasts succes/erreur, etats loading |

---

## Acceptance Criteria

### AC1: Formulaire d'inscription visible et fonctionnel (FR-1.1)

**Given** la page `/login` affichee en mode inscription
**When** je visualise le formulaire
**Then** les champs suivants sont presents :
- Email (input type email, requis)
- Mot de passe (input type password, requis)
- Confirmation mot de passe (input type password, requis)
**And** un bouton "Creer un compte" est visible
**And** un lien "Deja un compte ? Se connecter" permet de basculer

### AC2: Validation du formulaire d'inscription

**Given** le formulaire d'inscription affiche
**When** je soumets avec des donnees invalides
**Then** les erreurs s'affichent inline sous les champs :
- Email vide ou invalide → "Email invalide"
- Mot de passe < 6 caracteres → "Le mot de passe doit contenir au moins 6 caracteres"
- Confirmation differente → "Les mots de passe ne correspondent pas"
**And** le formulaire n'est pas soumis

### AC3: Inscription reussie

**Given** le formulaire d'inscription rempli avec des donnees valides
**When** je soumets le formulaire
**Then** un compte est cree via Supabase Auth (FR-1.1)
**And** je suis automatiquement connecte
**And** je suis redirige vers `/`
**And** un toast "Compte cree" s'affiche

### AC4: Formulaire de connexion visible et fonctionnel (FR-1.2)

**Given** la page `/login` affichee en mode connexion
**When** je visualise le formulaire
**Then** les champs suivants sont presents :
- Email (input type email, requis)
- Mot de passe (input type password, requis)
**And** un bouton "Se connecter" est visible
**And** un lien "Pas de compte ? S'inscrire" permet de basculer

### AC5: Connexion reussie

**Given** le formulaire de connexion avec identifiants corrects
**When** je soumets le formulaire
**Then** je suis connecte via Supabase Auth (FR-1.2)
**And** je suis redirige vers `/`
**And** un toast "Connecte" s'affiche

### AC6: Erreur de connexion

**Given** des identifiants incorrects
**When** je soumets le formulaire de connexion
**Then** un message d'erreur "Email ou mot de passe incorrect" s'affiche
**And** je reste sur la page login
**And** les champs ne sont pas vides (l'utilisateur peut corriger)

### AC7: Etats de chargement

**Given** un formulaire en cours de soumission
**When** l'API est appelee
**Then** le bouton est desactive et affiche un spinner
**And** les champs sont desactives pendant le chargement

---

## Tasks / Subtasks

- [x] **Task 1: Installation des composants Shadcn/ui necessaires** (AC: tous)
  - [x] 1.1 Installer `card`, `input`, `button`, `label`, `form` via shadcn CLI
  - [x] 1.2 Installer `sonner` pour les toasts
  - [x] 1.3 Installer React Hook Form et Zod (si pas deja fait)

- [x] **Task 2: Creation du schema de validation Zod** (AC: 2)
  - [x] 2.1 Creer `src/schemas/auth.ts`
  - [x] 2.2 Definir `loginSchema` (email, password)
  - [x] 2.3 Definir `registerSchema` (email, password, confirmPassword + refinement)

- [x] **Task 3: Creation de la page LoginPage** (AC: 1, 4)
  - [x] 3.1 Creer `src/pages/LoginPage.tsx`
  - [x] 3.2 Implementer le state pour le mode (login/register)
  - [x] 3.3 Implementer le layout avec Card centree
  - [x] 3.4 Ajouter le titre dynamique selon le mode

- [x] **Task 4: Implementation du formulaire d'inscription** (AC: 1, 2, 3)
  - [x] 4.1 Creer le formulaire avec React Hook Form
  - [x] 4.2 Connecter la validation Zod
  - [x] 4.3 Implementer les champs (email, password, confirmPassword)
  - [x] 4.4 Afficher les erreurs inline
  - [x] 4.5 Implementer la soumission avec signUp
  - [x] 4.6 Gerer le succes (toast + redirect)
  - [x] 4.7 Gerer les erreurs (toast ou message inline)

- [x] **Task 5: Implementation du formulaire de connexion** (AC: 4, 5, 6)
  - [x] 5.1 Creer le formulaire avec React Hook Form
  - [x] 5.2 Connecter la validation Zod
  - [x] 5.3 Implementer les champs (email, password)
  - [x] 5.4 Implementer la soumission avec signIn
  - [x] 5.5 Gerer le succes (toast + redirect)
  - [x] 5.6 Gerer l'erreur "Email ou mot de passe incorrect"

- [x] **Task 6: Gestion des etats de chargement** (AC: 7)
  - [x] 6.1 Implementer isSubmitting avec React Hook Form
  - [x] 6.2 Desactiver le bouton pendant la soumission
  - [x] 6.3 Ajouter un spinner dans le bouton
  - [x] 6.4 Desactiver les champs pendant la soumission

- [x] **Task 7: Configuration des toasts** (AC: 3, 5)
  - [x] 7.1 Ajouter le Toaster de Sonner dans App.tsx
  - [x] 7.2 Implementer les toasts de succes
  - [x] 7.3 Implementer les toasts d'erreur

- [x] **Task 8: Integration du routing** (AC: 3, 5)
  - [x] 8.1 Installer React Router si pas deja fait
  - [x] 8.2 Configurer la route `/login` dans App.tsx
  - [x] 8.3 Implementer la redirection apres connexion reussie

---

## Dev Notes

### Installation des composants

```bash
# Composants Shadcn/ui
npx shadcn@latest add card input button label form

# Toast
npx shadcn@latest add sonner

# React Hook Form + Zod (si pas deja installes)
npm install react-hook-form @hookform/resolvers zod

# React Router
npm install react-router-dom
```

### Schemas de validation

**Fichier : `src/schemas/auth.ts`**

```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
```

### Page LoginPage complete

**Fichier : `src/pages/LoginPage.tsx`**

```typescript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from '@/schemas/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  const onLogin = async (data: LoginFormData) => {
    const { error } = await signIn(data.email, data.password)
    if (error) {
      toast.error('Email ou mot de passe incorrect')
    } else {
      toast.success('Connecte')
      navigate('/')
    }
  }

  const onRegister = async (data: RegisterFormData) => {
    const { error } = await signUp(data.email, data.password)
    if (error) {
      toast.error(error.message || 'Erreur lors de la creation du compte')
    } else {
      toast.success('Compte cree')
      navigate('/')
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    loginForm.reset()
    registerForm.reset()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {mode === 'login' ? 'Connexion' : 'Inscription'}
          </CardTitle>
          <CardDescription>
            {mode === 'login'
              ? 'Connectez-vous a votre bibliotheque'
              : 'Creez votre compte pour commencer'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  disabled={loginForm.formState.isSubmitting}
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  disabled={loginForm.formState.isSubmitting}
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loginForm.formState.isSubmitting}
              >
                {loginForm.formState.isSubmitting ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  disabled={registerForm.formState.isSubmitting}
                  {...registerForm.register('email')}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  disabled={registerForm.formState.isSubmitting}
                  {...registerForm.register('password')}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  disabled={registerForm.formState.isSubmitting}
                  {...registerForm.register('confirmPassword')}
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={registerForm.formState.isSubmitting}
              >
                {registerForm.formState.isSubmitting ? 'Creation...' : 'Creer un compte'}
              </Button>
            </form>
          )}

          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary hover:underline"
            >
              {mode === 'login'
                ? "Pas de compte ? S'inscrire"
                : 'Deja un compte ? Se connecter'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Configuration App.tsx avec Router et Toaster

**Fichier : `src/App.tsx`**

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import LoginPage from '@/pages/LoginPage'

// Composant temporaire pour la page principale (sera remplace par BooksPage)
function HomePage() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-2xl font-bold">Ma Bibliotheque</h1>
      <p className="text-muted-foreground">Bienvenue, {user?.email}</p>
    </div>
  )
}

// Redirect si deja connecte
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="bottom-right" />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
```

### Messages toast (francais)

| Action | Message |
|--------|---------|
| Connexion reussie | "Connecte" |
| Inscription reussie | "Compte cree" |
| Erreur connexion | "Email ou mot de passe incorrect" |
| Erreur inscription | Message Supabase ou "Erreur lors de la creation du compte" |

---

## Project Structure Notes

### Fichiers crees/modifies

| Fichier | Action | Description |
|---------|--------|-------------|
| `src/schemas/auth.ts` | Creer | Schemas Zod login/register |
| `src/pages/LoginPage.tsx` | Creer | Page complete connexion/inscription |
| `src/App.tsx` | Modifier | Router + Toaster + routes |
| `src/components/ui/*.tsx` | Generer | Composants Shadcn |

### Alignement avec l'Architecture

[Source: docs/architecture.md#Frontend Architecture]

- **Form handling** : React Hook Form + Zod (PRD requirement)
- **Styling** : Tailwind + Shadcn/ui (PRD requirement)
- **Routing** : React Router 7 (PRD requirement)

---

## UX Requirements

[Source: docs/ux-design-specification.md#User Journey Flows - Journey 3]

### Layout

- Card centree verticalement et horizontalement
- Max-width 400px sur desktop
- Padding adaptatif sur mobile

### Validation

- Erreurs inline sous chaque champ
- Highlight rouge sur le champ en erreur
- Clear erreur des que l'utilisateur corrige

### Feedback

- Toast bottom-right (desktop), bottom-center (mobile)
- Duree 3 secondes pour succes
- Bouton disabled + spinner pendant soumission

---

## Architecture Compliance Checklist

- [x] LoginPage dans `src/pages/LoginPage.tsx`
- [x] Schemas Zod dans `src/schemas/auth.ts`
- [x] React Hook Form pour tous les formulaires
- [x] Toasts Sonner pour feedback
- [x] React Router configure
- [x] Redirection vers `/` apres succes
- [x] Redirection vers `/` si deja connecte

---

## Dependencies

### Story Dependencies

| Dependance | Type | Statut |
|------------|------|--------|
| Story 1.3 | Bloquante | ready-for-dev |

### Technical Dependencies

| Package | Version | Usage |
|---------|---------|-------|
| react-router-dom | ^7.x | Routing |
| react-hook-form | ^7.x | Forms |
| @hookform/resolvers | ^3.x | Zod integration |
| zod | ^3.x | Validation |
| sonner | latest | Toasts |

---

## Testing Requirements

### Tests manuels

1. **Inscription** :
   - Email invalide → erreur inline
   - Password < 6 chars → erreur inline
   - Passwords differents → erreur inline
   - Donnees valides → compte cree, toast, redirect

2. **Connexion** :
   - Email vide → erreur inline
   - Mauvais identifiants → toast erreur
   - Bons identifiants → toast succes, redirect

3. **Switch mode** :
   - Click lien → formulaire change
   - Champs resetés

4. **Deja connecte** :
   - Aller sur /login → redirect vers /

---

## References

- [Source: docs/architecture.md#Frontend Architecture]
- [Source: docs/architecture.md#Process Patterns]
- [Source: docs/ux-design-specification.md#User Journey Flows]
- [Source: docs/ux-design-specification.md#Form Patterns]
- [Source: docs/epics.md#Story 1.4]
- [Source: CLAUDE.md#Toast Messages]

---

## Dev Agent Record

### Context Reference

Story context generated by SM agent (Bob) on 2025-12-18.
Vertical slice approach: UI + Logic + Data integration complete.

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes List

Implementation completed on 2025-12-18 by Dev Agent (Amelia).

**Summary:**
- Composants Shadcn/ui installes: card, input, button, label, form, sonner
- Dependencies ajoutees: react-router-dom, react-hook-form, @hookform/resolvers, zod, sonner
- Schemas Zod crees pour validation login et register avec messages d'erreur en francais
- LoginPage complete avec modes login/register, validation inline, etats de chargement
- App.tsx reconfigure avec BrowserRouter, routes, Toaster Sonner
- PublicRoute et ProtectedRoute implementes pour gestion des acces
- Build TypeScript reussit sans erreur

**Verifications effectuees:**
- `npm run build` - Success, aucune erreur TypeScript
- Tous les composants Shadcn generes correctement
- Validation Zod testee avec les schemas

### File List

**New Files:**
- `ma-bibliotheque/src/schemas/auth.ts`
- `ma-bibliotheque/src/pages/LoginPage.tsx`
- `ma-bibliotheque/src/components/ui/card.tsx`
- `ma-bibliotheque/src/components/ui/input.tsx`
- `ma-bibliotheque/src/components/ui/button.tsx`
- `ma-bibliotheque/src/components/ui/label.tsx`
- `ma-bibliotheque/src/components/ui/form.tsx`
- `ma-bibliotheque/src/components/ui/sonner.tsx`

**Modified Files:**
- `ma-bibliotheque/src/App.tsx` (Router + Toaster + routes)
- `ma-bibliotheque/package.json` (nouvelles dependencies)
- `ma-bibliotheque/package-lock.json`

### Change Log

- 2025-12-18: Story 1.4 implemented - Login page with registration and login forms

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
- [x] References aux documents sources
- [x] Testing requirements definis

**Status: READY FOR DEVELOPMENT**
