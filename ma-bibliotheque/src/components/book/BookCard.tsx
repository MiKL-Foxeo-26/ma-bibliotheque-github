import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './StatusBadge'
import { cn } from '@/lib/utils'
import type { Book, BookStatus } from '@/types/book'

interface BookCardProps {
  book: Book
  onStatusChange: (status: BookStatus) => void
  onEdit: () => void
  onDelete: () => void
}

export function BookCard({
  book,
  onStatusChange,
  onEdit,
  onDelete,
}: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className={cn(
        'relative transition-all duration-300 ease-out',
        // Style Five Pathways - ombre offset solide
        'shadow-[4px_4px_0_0_#1a1a1a]',
        // Hover: lift up avec ombre plus grande
        isHovered && 'shadow-[6px_6px_0_0_#1a1a1a] -translate-x-0.5 -translate-y-0.5'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`${book.title} par ${book.author}, statut: ${book.status}`}
    >
      {/* Badge de statut en haut a droite */}
      <div className="absolute top-3 right-3">
        <StatusBadge
          status={book.status}
          onChange={onStatusChange}
          interactive
        />
      </div>

      <CardContent className="pt-6 pb-4">
        {/* Titre du livre */}
        <h3 className="font-semibold text-lg leading-tight truncate pr-20 mb-1">
          {book.title}
        </h3>

        {/* Auteur */}
        <p className="text-muted-foreground text-sm truncate">
          {book.author}
        </p>

        {/* Actions - visibles au hover sur desktop */}
        <div
          className={cn(
            'flex gap-2 mt-4 transition-opacity duration-200',
            // Sur mobile, toujours visible. Sur desktop, visible au hover
            'opacity-100 sm:opacity-0',
            isHovered && 'sm:opacity-100'
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            aria-label={`Editer ${book.title}`}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Editer
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
            aria-label={`Supprimer ${book.title}`}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
