# Non-Functional Requirements

## Performance

- Chargement initial < 3 secondes
- Ajout/modification d'un livre < 1 seconde
- Filtrage instantané (côté client)

## Sécurité

- Authentification via Supabase Auth
- Row Level Security (RLS) sur la table books
- Chaque utilisateur ne voit que ses propres livres
- HTTPS obligatoire

## Disponibilité

- Hébergement Vercel (99.9% uptime)
- Base de données Supabase (managed)

## Compatibilité

- Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Responsive : Desktop, Tablet, Mobile
- Mobile-first design
