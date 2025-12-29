import { supabase } from './supabase'
import type { Book, BookInsert, BookUpdate } from '@/types/book'

/**
 * Recupere tous les livres d'un utilisateur
 * Tries par date de creation (recent en premier)
 */
export async function getBooks(userId: string): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

/**
 * Ajoute un nouveau livre pour un utilisateur
 * Retourne le livre cree avec son id genere
 */
export async function addBook(
  userId: string,
  bookData: Omit<BookInsert, 'user_id'>
): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .insert({
      ...bookData,
      user_id: userId,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Met a jour un livre existant
 * Retourne le livre modifie
 */
export async function updateBook(
  id: string,
  bookData: BookUpdate
): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .update({
      ...bookData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Supprime un livre par son id
 */
export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Met a jour uniquement le statut d'un livre
 * Fonction utilitaire pour le changement rapide de statut
 */
export async function updateBookStatus(
  id: string,
  status: Book['status']
): Promise<Book> {
  return updateBook(id, { status })
}
