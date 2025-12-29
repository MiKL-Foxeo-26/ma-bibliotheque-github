import { BookCard } from '@/components/book/BookCard'
import type { Book, BookStatus } from '@/types/book'

interface BookListProps {
  books: Book[]
  onEditBook: (book: Book) => void
  onDeleteBook: (id: string) => void
  onStatusChange: (id: string, status: BookStatus) => void
}

export function BookList({
  books,
  onEditBook,
  onDeleteBook,
  onStatusChange,
}: BookListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onStatusChange={(status) => onStatusChange(book.id, status)}
          onEdit={() => onEditBook(book)}
          onDelete={() => onDeleteBook(book.id)}
        />
      ))}
    </div>
  )
}
