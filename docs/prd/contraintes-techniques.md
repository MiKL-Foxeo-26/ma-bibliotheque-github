# Contraintes Techniques

## Stack imposée

- Frontend : React 18 + Vite 5.x
- Routing : React Router 7.x
- UI : Shadcn/ui + TweakCN
- Backend : Supabase (auth + database)
- Déploiement : Vercel

## Limitations Supabase

- ❌ Pas d'Edge Functions
- ❌ Pas de Storage (images)
- ❌ Pas de Realtime

## Implications

- Toute la logique métier côté client (React)
- Pas de traitement serveur custom
- Pas d'upload d'images (couvertures)
- Pas de synchronisation temps réel entre devices

