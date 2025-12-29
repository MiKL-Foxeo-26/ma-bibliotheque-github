# Data Model

## Table : books

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PK, default gen_random_uuid() | Identifiant unique |
| user_id | uuid | FK → auth.users, NOT NULL | Propriétaire du livre |
| title | text | NOT NULL | Titre du livre |
| author | text | NOT NULL | Auteur du livre |
| status | text | NOT NULL, CHECK (status IN ('to_read', 'reading', 'read')) | Statut de lecture |
| created_at | timestamptz | default now() | Date de création |
| updated_at | timestamptz | default now() | Date de modification |

## Row Level Security (RLS)

```sql
-- Politique : les utilisateurs ne voient que leurs propres livres
CREATE POLICY "Users can only access their own books"
ON books FOR ALL
USING (auth.uid() = user_id);
```
