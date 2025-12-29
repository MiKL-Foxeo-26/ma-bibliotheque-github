import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { toast } from 'sonner'
import { BookPlus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getBooks, addBook, updateBook, updateBookStatus, deleteBook } from '@/lib/books'
import { Button } from '@/components/ui/button'
import { BookList } from '@/components/library/BookList'
import { BookListSkeleton } from '@/components/library/SkeletonCard'
import { EmptyLibrary } from '@/components/library/EmptyLibrary'
import { StatusFilter, type FilterValue } from '@/components/library/StatusFilter'
import { FilteredEmptyState } from '@/components/library/FilteredEmptyState'
import { AddBookDialog } from '@/components/book/AddBookDialog'
import { EditBookDialog } from '@/components/book/EditBookDialog'
import { DeleteConfirmDialog } from '@/components/book/DeleteConfirmDialog'
import type { Book, BookStatus } from '@/types/book'
import type { BookFormData } from '@/schemas/book'

export default function BooksPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null)

  // Delete states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingBook, setDeletingBook] = useState<Book | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Undo toast state (bypass Sonner bug)
  const [undoToast, setUndoToast] = useState<{ book: Book; userId: string } | null>(null)
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Filter state
  const [filterStatus, setFilterStatus] = useState<FilterValue>('all')

  // Calculer les livres filtres
  const filteredBooks = useMemo(() => {
    if (filterStatus === 'all') {
      return books
    }
    return books.filter((book) => book.status === filterStatus)
  }, [books, filterStatus])

  // Calculer les compteurs par statut
  const counts = useMemo(() => {
    return {
      all: books.length,
      to_read: books.filter((b) => b.status === 'to_read').length,
      reading: books.filter((b) => b.status === 'reading').length,
      read: books.filter((b) => b.status === 'read').length,
    }
  }, [books])

  // Reset filter
  const handleResetFilter = () => {
    setFilterStatus('all')
  }

  // Fetch des livres au chargement
  const fetchBooks = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await getBooks(user.id)
      setBooks(data)
    } catch (err) {
      console.error('Erreur lors du chargement des livres:', err)
      setError('Impossible de charger vos livres')
      toast.error('Erreur lors du chargement')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  // Handler pour ouvrir le dialog d'ajout
  const handleAddBook = () => {
    setIsAddDialogOpen(true)
  }

  // Handler pour soumettre le nouveau livre avec Optimistic UI
  const handleAddBookSubmit = async (data: BookFormData) => {
    if (!user) return

    // Creer un livre temporaire pour Optimistic UI
    const tempId = `temp-${Date.now()}`
    const tempBook: Book = {
      id: tempId,
      user_id: user.id,
      title: data.title,
      author: data.author,
      status: data.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Ajout optimiste - le nouveau livre apparait immediatement en premier
    setBooks((prev) => [tempBook, ...prev])

    try {
      // Appel API reel
      const createdBook = await addBook(user.id, data)

      // Remplacer le livre temporaire par le livre reel
      setBooks((prev) =>
        prev.map((book) => (book.id === tempId ? createdBook : book))
      )

      toast.success('Livre ajoute')
    } catch (error) {
      // Rollback en cas d'erreur
      setBooks((prev) => prev.filter((book) => book.id !== tempId))
      toast.error("Erreur lors de l'ajout")
      console.error(error)
      throw error // Re-throw pour que le dialog sache qu'il y a eu une erreur
    }
  }

  // Handler pour ouvrir le dialog d'edition
  const handleEditBook = (book: Book) => {
    setBookToEdit(book)
  }

  // Handler pour soumettre les modifications avec Optimistic UI
  const handleEditBookSubmit = async (bookId: string, data: BookFormData) => {
    // Sauvegarder l'etat precedent pour rollback
    const previousBooks = [...books]

    // Optimistic update - mise a jour immediate
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId
          ? { ...book, ...data, updated_at: new Date().toISOString() }
          : book
      )
    )

    try {
      await updateBook(bookId, data)
      toast.success('Livre modifie')
    } catch (error) {
      // Rollback en cas d'erreur
      setBooks(previousBooks)
      toast.error('Erreur lors de la modification')
      console.error(error)
      throw error
    }
  }

  // Handler pour ouvrir le dialog de suppression
  const handleDeleteBook = (id: string) => {
    const book = books.find((b) => b.id === id)
    if (book) {
      setDeletingBook(book)
      setIsDeleteDialogOpen(true)
    }
  }

  // Handler pour confirmer la suppression
  const handleConfirmDelete = async () => {
    if (!deletingBook || !user) return

    setIsDeleting(true)

    // Optimistic delete
    setBooks((prev) => prev.filter((book) => book.id !== deletingBook.id))
    setIsDeleteDialogOpen(false)

    // Clear any existing undo timeout
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current)
    }

    try {
      await deleteBook(deletingBook.id)

      // Afficher notre propre toast (bypass Sonner)
      setUndoToast({ book: { ...deletingBook }, userId: user.id })
      toast.success('Livre supprime')

      // Timeout pour cacher le toast undo apres 5s
      undoTimeoutRef.current = setTimeout(() => {
        setUndoToast(null)
      }, 5000)

    } catch (error) {
      // Rollback - restaurer le livre si erreur
      if (deletingBook) {
        setBooks((prev) => [deletingBook, ...prev])
      }
      toast.error('Erreur lors de la suppression')
      console.error(error)
    } finally {
      setIsDeleting(false)
      setDeletingBook(null)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current)
      }
    }
  }, [])

  // Optimistic UI pour le changement de statut
  const handleStatusChange = async (id: string, status: BookStatus) => {
    // Sauvegarder l'etat precedent pour rollback
    const previousBooks = [...books]
    const bookToUpdate = books.find((b) => b.id === id)

    if (!bookToUpdate) return

    // Optimistic update - mise a jour immediate
    setBooks((prev) =>
      prev.map((book) =>
        book.id === id ? { ...book, status } : book
      )
    )

    try {
      await updateBookStatus(id, status)
      toast.success('Statut mis a jour')
    } catch (error) {
      // Rollback en cas d'erreur
      setBooks(previousBooks)
      toast.error('Erreur lors de la mise a jour du statut')
      console.error(error)
    }
  }

  return (
    <div className="container py-6">
      {/* Filtres + Bouton ajouter */}
      {!isLoading && !error && books.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <StatusFilter
            value={filterStatus}
            onChange={setFilterStatus}
            counts={counts}
          />

          {/* Bouton ajouter - visible desktop uniquement, FAB sur mobile */}
          <Button onClick={handleAddBook} className="hidden sm:flex">
            <BookPlus className="mr-2 h-4 w-4" />
            Ajouter un livre
          </Button>
        </div>
      )}

      {/* Contenu principal */}
      {isLoading ? (
        <BookListSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={fetchBooks}>
            Reessayer
          </Button>
        </div>
      ) : books.length === 0 ? (
        <EmptyLibrary onAddBook={handleAddBook} />
      ) : filteredBooks.length === 0 ? (
        <FilteredEmptyState
          status={filterStatus as BookStatus}
          onResetFilter={handleResetFilter}
        />
      ) : (
        <BookList
          books={filteredBooks}
          onEditBook={handleEditBook}
          onDeleteBook={handleDeleteBook}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* FAB Mobile */}
      {!isLoading && books.length > 0 && (
        <Button
          onClick={handleAddBook}
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg sm:hidden"
          aria-label="Ajouter un livre"
        >
          <BookPlus className="h-6 w-6" />
        </Button>
      )}

      {/* Dialog d'ajout de livre */}
      <AddBookDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddBookSubmit}
      />

      {/* Dialog d'edition de livre */}
      <EditBookDialog
        book={bookToEdit}
        onClose={() => setBookToEdit(null)}
        onSubmit={handleEditBookSubmit}
      />

      {/* Dialog de confirmation de suppression */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        bookTitle={deletingBook?.title ?? ''}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Toast Undo personnalise (bypass Sonner) */}
      {undoToast && (
        <div
          className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 bg-white border-2 border-border rounded-lg p-4 shadow-lg animate-slide-up"
          style={{ pointerEvents: 'auto' }}
        >
          <span className="text-sm font-medium">Livre supprime</span>
          <button
            type="button"
            onClick={() => {
              console.log('=== CUSTOM UNDO CLICKED ===')
              const { book, userId } = undoToast

              // Clear timeout et toast
              if (undoTimeoutRef.current) {
                clearTimeout(undoTimeoutRef.current)
                undoTimeoutRef.current = null
              }
              setUndoToast(null)

              // Re-creer le livre
              addBook(userId, {
                title: book.title,
                author: book.author,
                status: book.status,
              })
                .then((restoredBook) => {
                  setBooks((prev) => [restoredBook, ...prev])
                  toast.success('Livre restaure')
                })
                .catch((err) => {
                  toast.error('Erreur lors de la restauration')
                  console.error(err)
                })
            }}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  )
}
