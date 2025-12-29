/**
 * Statuts de lecture possibles pour un livre
 * Alignes avec la contrainte CHECK de la table Supabase
 */
export type BookStatus = 'to_read' | 'reading' | 'read'

/**
 * Interface Book - correspond exactement au schema Supabase
 * Les noms de colonnes sont en snake_case (convention Supabase)
 */
export interface Book {
  id: string
  user_id: string
  title: string
  author: string
  status: BookStatus
  created_at: string
  updated_at: string
}

/**
 * Type pour la creation d'un livre (sans id et timestamps)
 */
export type BookInsert = Omit<Book, 'id' | 'created_at' | 'updated_at'>

/**
 * Type pour la mise a jour d'un livre (tous les champs optionnels sauf id)
 */
export type BookUpdate = Partial<Omit<Book, 'id' | 'user_id' | 'created_at'>>
