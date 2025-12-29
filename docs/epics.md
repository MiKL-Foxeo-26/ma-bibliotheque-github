---
stepsCompleted: [1, 2, 3, 4]
status: 'complete'
completedAt: '2025-12-18'
inputDocuments:
  - docs/prd/index.md
  - docs/prd/functional-requirements.md
  - docs/prd/non-functional-requirements.md
  - docs/architecture.md
  - docs/ux-design-specification.md
workflowType: 'epics-stories'
lastStep: 4
project_name: 'Ma Bibliotheque'
user_name: 'MiKL'
date: '2025-12-18'
---

# Ma Bibliotheque - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Ma Bibliotheque, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

| ID | Exigence | Priorité |
|----|----------|----------|
| FR-1.1 | L'utilisateur peut créer un compte avec email/mot de passe | Must |
| FR-1.2 | L'utilisateur peut se connecter à son compte | Must |
| FR-1.3 | L'utilisateur peut se déconnecter | Must |
| FR-1.4 | Les données sont isolées par utilisateur | Must |
| FR-2.1 | Voir la liste de tous mes livres | Must |
| FR-2.2 | Ajouter un livre (titre, auteur, statut) | Must |
| FR-2.3 | Modifier les informations d'un livre | Must |
| FR-2.4 | Supprimer un livre | Must |
| FR-2.5 | Filtrer les livres par statut | Must |
| FR-3.1 | Statut "À lire" disponible | Must |
| FR-3.2 | Statut "En cours" disponible | Must |
| FR-3.3 | Statut "Lu" disponible | Must |

### NonFunctional Requirements

**Performance :**
- NFR-1 : Chargement initial < 3 secondes
- NFR-2 : Ajout/modification d'un livre < 1 seconde
- NFR-3 : Filtrage instantané (côté client)

**Sécurité :**
- NFR-4 : Authentification via Supabase Auth
- NFR-5 : Row Level Security (RLS) sur la table books
- NFR-6 : Chaque utilisateur ne voit que ses propres livres
- NFR-7 : HTTPS obligatoire

**Disponibilité :**
- NFR-8 : Hébergement Vercel (99.9% uptime)
- NFR-9 : Base de données Supabase (managed)

**Compatibilité :**
- NFR-10 : Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- NFR-11 : Responsive : Desktop, Tablet, Mobile
- NFR-12 : Mobile-first design

### Additional Requirements

**Starter Template (Architecture) :**
- Initialisation avec `npm create vite@latest ma-bibliotheque -- --template react-ts`
- TypeScript 5.x en mode strict
- Tailwind CSS v4 via Vite plugin

**Décisions Techniques (Architecture) :**
- State Management : React useState + Context
- Formulaires : React Hook Form + Zod
- Data Layer : Service functions dans lib/
- Auth Pattern : AuthContext avec ProtectedRoute
- Routing : React Router 7 (/, /login, /books)
- Variables d'environnement : VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

**Structure de Projet (Architecture) :**
- Composants organisés par domaine (book/, library/, layout/)
- Tests co-localisés (*.test.tsx)
- Schémas Zod dans schemas/

**Responsive Design (UX) :**
- Mobile (< 640px) : Liste 1 colonne, FAB, Sheet pour formulaires, Swipe actions
- Tablet (640-1024px) : Grille 2 colonnes, Dialog pour formulaires
- Desktop (> 1024px) : Grille 3-4 colonnes, Hover actions

**Composants UX Spécifiques :**
- EmptyLibrary : État vide accueillant avec CTA
- StatusBadge : Badge cliquable pour changement de statut inline
- StatusFilter : Toggle Group pour filtrage instantané
- BookCard : Card avec ombre directionnelle, actions contextuelles
- BookForm : Formulaire 3 champs avec validation inline

**Patterns d'Interaction (UX) :**
- Optimistic UI pour toutes les mutations
- Toast (Sonner) pour feedback non-bloquant
- Alert Dialog léger pour confirmation de suppression
- Undo disponible 5 secondes après suppression

**Accessibilité WCAG 2.1 AA (UX) :**
- Touch targets minimum 44x44px
- Navigation clavier complète
- Skip link vers contenu principal
- ARIA labels sur tous les composants custom
- Contraste AA vérifié

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR-1.1 | Epic 1 | Création de compte email/mot de passe |
| FR-1.2 | Epic 1 | Connexion au compte |
| FR-1.3 | Epic 1 | Déconnexion |
| FR-1.4 | Epic 1 | Isolation des données par utilisateur |
| FR-2.1 | Epic 2 | Voir la liste des livres |
| FR-2.2 | Epic 2 | Ajouter un livre |
| FR-2.3 | Epic 2 | Modifier un livre |
| FR-2.4 | Epic 2 | Supprimer un livre |
| FR-2.5 | Epic 2 | Filtrer par statut |
| FR-3.1 | Epic 2 | Statut "À lire" |
| FR-3.2 | Epic 2 | Statut "En cours" |
| FR-3.3 | Epic 2 | Statut "Lu" |

**Couverture : 12/12 FRs (100%)**

## Epic List

### Epic 1: Fondation et Authentification
Les utilisateurs peuvent accéder à l'application, créer un compte, se connecter et avoir leurs données protégées.

**Valeur utilisateur :** "Je peux accéder à mon espace personnel sécurisé"

**FRs couverts :** FR-1.1, FR-1.2, FR-1.3, FR-1.4

**Notes d'implémentation :**
- Initialisation du projet (starter template Vite + React-TS)
- Configuration Supabase avec RLS pour l'isolation des données
- AuthContext et ProtectedRoute
- Page Login avec formulaires inscription/connexion

### Epic 2: Gestion de la Bibliothèque
Les utilisateurs peuvent gérer leur collection complète de livres avec suivi des statuts de lecture.

**Valeur utilisateur :** "Je peux cataloguer mes livres et savoir instantanément si je possède un livre"

**FRs couverts :** FR-2.1, FR-2.2, FR-2.3, FR-2.4, FR-2.5, FR-3.1, FR-3.2, FR-3.3

**Notes d'implémentation :**
- Liste des livres avec filtrage par statut
- Ajout/édition/suppression de livres
- Trois statuts (À lire, En cours, Lu)
- Composants UX : BookCard, BookForm, StatusBadge, StatusFilter, EmptyLibrary
- Responsive : Sheet (mobile) / Dialog (desktop)
- Optimistic UI et toasts de feedback

---

## Epic 1: Fondation et Authentification

Les utilisateurs peuvent accéder à l'application, créer un compte, se connecter et avoir leurs données protégées.

### Story 1.1: Initialisation du projet et configuration de base

As a **développeur**,
I want **un projet React configuré avec les outils du stack technique**,
So that **je puisse commencer le développement de l'application**.

**Acceptance Criteria:**

**Given** un environnement de développement vierge
**When** j'exécute `npm create vite@latest ma-bibliotheque -- --template react-ts`
**Then** un projet React 18 + TypeScript est créé
**And** la structure de dossiers suit l'Architecture (src/components/, src/lib/, src/pages/, etc.)

**Given** le projet initialisé
**When** j'installe et configure Tailwind CSS v4 et Shadcn/ui
**Then** les composants Shadcn/ui sont disponibles (button, card, input, etc.)
**And** les CSS variables du design system TweakCN sont intégrées dans index.css
**And** le thème supporte le mode clair et sombre

**Given** le projet configuré
**When** je lance `npm run dev`
**Then** l'application démarre sans erreur
**And** le hot reload fonctionne

---

### Story 1.2: Configuration Supabase et schéma de base de données

As a **développeur**,
I want **Supabase configuré avec le schéma de données**,
So that **l'application puisse stocker et isoler les données utilisateur**.

**Acceptance Criteria:**

**Given** un projet Supabase existant
**When** je configure le client Supabase dans `src/lib/supabase.ts`
**Then** le client utilise les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
**And** un fichier `.env.example` documente les variables requises

**Given** le client Supabase configuré
**When** je crée la table `books` via migration SQL
**Then** la table contient les colonnes : id (uuid), user_id (uuid), title (text), author (text), status (text), created_at (timestamp), updated_at (timestamp)
**And** une contrainte CHECK limite status à 'to_read', 'reading', 'read'

**Given** la table `books` créée
**When** je configure les politiques RLS
**Then** chaque utilisateur ne peut voir/modifier que ses propres livres (FR-1.4)
**And** les opérations INSERT, SELECT, UPDATE, DELETE sont protégées

---

### Story 1.3: Contexte d'authentification et gestion de session

As a **utilisateur**,
I want **que ma session soit gérée automatiquement**,
So that **je reste connecté entre les visites**.

**Acceptance Criteria:**

**Given** le fichier `src/contexts/AuthContext.tsx` créé
**When** j'implémente le AuthContext
**Then** il expose : user, session, isLoading, signUp, signIn, signOut
**And** le hook `useAuth()` permet d'accéder au contexte

**Given** l'application chargée
**When** Supabase Auth détecte une session existante
**Then** l'utilisateur est automatiquement connecté
**And** l'état `isLoading` passe de true à false une fois la vérification terminée

**Given** aucune session active
**When** l'utilisateur accède à une route protégée
**Then** il est redirigé vers `/login`

**Given** une session active
**When** l'utilisateur accède à `/login`
**Then** il est redirigé vers `/` (page principale)

---

### Story 1.4: Page de connexion avec inscription et connexion

As a **utilisateur**,
I want **pouvoir créer un compte et me connecter**,
So that **j'accède à ma bibliothèque personnelle**.

**Acceptance Criteria:**

**Given** la page `/login` affichée
**When** je suis en mode inscription
**Then** un formulaire affiche : Email, Mot de passe, Confirmation mot de passe
**And** un lien permet de basculer vers le mode connexion

**Given** le formulaire d'inscription rempli avec des données valides
**When** je soumets le formulaire
**Then** un compte est créé via Supabase Auth (FR-1.1)
**And** je suis automatiquement connecté et redirigé vers `/`
**And** un toast "Compte créé" s'affiche

**Given** le formulaire d'inscription avec email invalide ou mots de passe non concordants
**When** je soumets le formulaire
**Then** une erreur inline s'affiche sous le champ concerné
**And** le formulaire n'est pas soumis

**Given** la page `/login` en mode connexion
**When** je saisis email et mot de passe corrects et soumets
**Then** je suis connecté via Supabase Auth (FR-1.2)
**And** je suis redirigé vers `/`
**And** un toast "Connecté" s'affiche

**Given** des identifiants incorrects
**When** je soumets le formulaire de connexion
**Then** un message d'erreur "Email ou mot de passe incorrect" s'affiche
**And** je reste sur la page login

---

### Story 1.5: Routes protégées et déconnexion

As a **utilisateur connecté**,
I want **pouvoir me déconnecter et que mes pages soient protégées**,
So that **mes données restent sécurisées**.

**Acceptance Criteria:**

**Given** le composant `ProtectedRoute` créé
**When** un utilisateur non authentifié accède à une route protégée
**Then** il est redirigé vers `/login`
**And** la route protégée n'est pas rendue

**Given** un utilisateur authentifié
**When** il accède à une route protégée
**Then** le contenu de la page s'affiche normalement

**Given** le composant `Header` avec bouton déconnexion
**When** l'utilisateur clique sur "Déconnexion"
**Then** la session est supprimée via Supabase Auth (FR-1.3)
**And** l'utilisateur est redirigé vers `/login`
**And** un toast "Déconnecté" s'affiche

**Given** l'application avec React Router configuré
**When** les routes sont définies
**Then** `/login` est accessible publiquement
**And** `/` (BooksPage) est protégée par ProtectedRoute
**And** le Header s'affiche sur les pages protégées

---

## Epic 2: Gestion de la Bibliothèque

Les utilisateurs peuvent gérer leur collection complète de livres avec suivi des statuts de lecture.

### Story 2.1: Service layer et types pour les livres

As a **développeur**,
I want **une couche de service typée pour les opérations sur les livres**,
So that **le code soit maintenable et les données validées**.

**Acceptance Criteria:**

**Given** le fichier `src/types/book.ts` créé
**When** je définis l'interface Book
**Then** elle contient : id, user_id, title, author, status, created_at, updated_at
**And** status est typé comme `'to_read' | 'reading' | 'read'`

**Given** le fichier `src/schemas/book.ts` créé
**When** je définis le schéma Zod bookFormSchema
**Then** il valide : title (requis, 1-200 chars), author (requis, 1-100 chars), status (enum)
**And** le type BookFormData est inféré du schéma

**Given** le fichier `src/lib/books.ts` créé
**When** j'implémente les fonctions CRUD
**Then** `getBooks(userId)` retourne tous les livres de l'utilisateur
**And** `addBook(userId, data)` crée un livre et retourne le livre créé
**And** `updateBook(id, data)` modifie un livre et retourne le livre modifié
**And** `deleteBook(id)` supprime un livre
**And** chaque fonction gère les erreurs Supabase correctement

---

### Story 2.2: Page bibliothèque et liste des livres

As a **utilisateur connecté**,
I want **voir la liste de tous mes livres**,
So that **je sache quels livres je possède** (FR-2.1).

**Acceptance Criteria:**

**Given** l'utilisateur connecté accède à `/`
**When** la page BooksPage se charge
**Then** tous ses livres sont récupérés via getBooks()
**And** un état de chargement (skeleton) s'affiche pendant le fetch
**And** les livres s'affichent dans une grille responsive (1/2/3-4 colonnes)

**Given** l'utilisateur n'a aucun livre
**When** la page se charge
**Then** le composant EmptyLibrary s'affiche
**And** une illustration d'étagère vide est visible
**And** le message "Votre bibliothèque est vide" s'affiche
**And** un bouton "Ajouter un livre" est présent et fonctionnel

**Given** le composant BookList créé
**When** il reçoit une liste de livres
**Then** chaque livre est rendu via BookCard
**And** les livres sont triés par date d'ajout (récent en premier)

---

### Story 2.3: Composant BookCard avec StatusBadge

As a **utilisateur**,
I want **voir chaque livre avec son statut clairement identifiable**,
So that **je reconnaisse instantanément l'état de mes lectures** (FR-3.1, FR-3.2, FR-3.3).

**Acceptance Criteria:**

**Given** le composant BookCard rendu
**When** il affiche un livre
**Then** le titre s'affiche en gras (truncate si trop long)
**And** l'auteur s'affiche en texte muted
**And** le StatusBadge est visible dans le coin supérieur droit
**And** une ombre directionnelle 3px 3px est appliquée

**Given** le composant StatusBadge
**When** le statut est "to_read"
**Then** le badge affiche "À lire" avec couleur `--muted`

**Given** le statut est "reading"
**When** le badge est rendu
**Then** il affiche "En cours" avec couleur `--secondary` (doré)

**Given** le statut est "read"
**When** le badge est rendu
**Then** il affiche "Lu" avec couleur `--primary` (vert)

**Given** l'utilisateur clique sur le StatusBadge
**When** le dropdown s'ouvre
**Then** les 3 options de statut sont affichées
**And** la sélection d'un nouveau statut appelle updateBook()
**And** le badge se met à jour immédiatement (Optimistic UI)
**And** un toast "Statut mis à jour" s'affiche

---

### Story 2.4: Ajout de livre avec formulaire

As a **utilisateur**,
I want **ajouter un nouveau livre à ma collection**,
So that **je puisse cataloguer mes achats** (FR-2.2).

**Acceptance Criteria:**

**Given** l'utilisateur sur la page bibliothèque (mobile)
**When** il clique sur le FAB (+)
**Then** un Sheet slide-up s'ouvre avec le formulaire BookForm

**Given** l'utilisateur sur la page bibliothèque (desktop)
**When** il clique sur le bouton "Ajouter un livre" dans le header
**Then** un Dialog modal s'ouvre avec le formulaire BookForm

**Given** le formulaire BookForm en mode création
**When** il s'affiche
**Then** les champs Titre, Auteur sont vides
**And** le statut est pré-sélectionné sur "À lire"
**And** le bouton submit affiche "Ajouter"

**Given** le formulaire rempli avec des données valides
**When** l'utilisateur soumet
**Then** addBook() est appelé avec les données
**And** le nouveau livre apparaît immédiatement dans la liste (Optimistic UI)
**And** le formulaire se ferme automatiquement
**And** un toast "Livre ajouté" s'affiche

**Given** le formulaire avec champs vides ou invalides
**When** l'utilisateur tente de soumettre
**Then** les erreurs s'affichent inline sous chaque champ concerné
**And** le formulaire n'est pas soumis

---

### Story 2.5: Modification de livre

As a **utilisateur**,
I want **modifier les informations d'un livre existant**,
So that **je puisse corriger des erreurs ou mettre à jour les données** (FR-2.3).

**Acceptance Criteria:**

**Given** un BookCard affiché (desktop)
**When** l'utilisateur survole la carte
**Then** les actions Éditer et Supprimer apparaissent

**Given** un BookCard affiché (mobile)
**When** l'utilisateur swipe vers la gauche
**Then** les actions Éditer et Supprimer apparaissent

**Given** l'utilisateur clique sur "Éditer"
**When** le formulaire s'ouvre
**Then** BookForm est en mode édition
**And** les champs sont pré-remplis avec les données actuelles du livre
**And** le bouton submit affiche "Sauvegarder"

**Given** le formulaire d'édition soumis avec des modifications
**When** la soumission réussit
**Then** updateBook() est appelé avec les nouvelles données
**And** le BookCard se met à jour immédiatement (Optimistic UI)
**And** le formulaire se ferme
**And** un toast "Livre modifié" s'affiche

---

### Story 2.6: Suppression de livre avec confirmation

As a **utilisateur**,
I want **supprimer un livre de ma collection**,
So that **je puisse retirer les livres que je ne possède plus** (FR-2.4).

**Acceptance Criteria:**

**Given** l'utilisateur clique sur "Supprimer" (via hover ou swipe)
**When** l'action est déclenchée
**Then** un AlertDialog s'affiche avec le message "Supprimer ce livre ?"
**And** deux boutons sont présents : "Annuler" et "Supprimer"

**Given** l'utilisateur clique sur "Annuler"
**When** le dialog se ferme
**Then** aucune action n'est effectuée
**And** le livre reste dans la liste

**Given** l'utilisateur confirme la suppression
**When** il clique sur "Supprimer"
**Then** le livre disparaît immédiatement de la liste (Optimistic UI)
**And** deleteBook() est appelé
**And** un toast "Livre supprimé" s'affiche avec option "Annuler" pendant 5 secondes

**Given** l'utilisateur clique sur "Annuler" dans le toast
**When** l'action est dans les 5 secondes
**Then** le livre est restauré dans la liste
**And** la suppression côté serveur est annulée

---

### Story 2.7: Filtrage par statut

As a **utilisateur**,
I want **filtrer mes livres par statut de lecture**,
So that **je trouve rapidement les livres d'une catégorie** (FR-2.5).

**Acceptance Criteria:**

**Given** le composant StatusFilter affiché
**When** il se rend
**Then** un Toggle Group affiche : "Tous", "À lire", "En cours", "Lu"
**And** chaque option affiche le compteur de livres correspondant
**And** "Tous" est sélectionné par défaut

**Given** l'utilisateur clique sur "À lire"
**When** le filtre est appliqué
**Then** seuls les livres avec status "to_read" sont affichés
**And** le filtrage est instantané (côté client, pas de requête serveur)
**And** le compteur total se met à jour

**Given** un filtre actif sans résultat
**When** aucun livre ne correspond
**Then** un message "Aucun livre [statut]" s'affiche
**And** un lien "Voir tous les livres" permet de réinitialiser le filtre

**Given** l'utilisateur ajoute/modifie/supprime un livre
**When** la liste change
**Then** les compteurs du StatusFilter sont recalculés automatiquement
**And** le filtre actif reste appliqué
