import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import type { BookStatus } from '@/types/book'

interface FilteredEmptyStateProps {
  status: BookStatus
  onResetFilter: () => void
}

const statusLabels: Record<BookStatus, string> = {
  to_read: 'a lire',
  reading: 'en cours',
  read: 'lu',
}

export function FilteredEmptyState({
  status,
  onResetFilter,
}: FilteredEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Search className="h-12 w-12 text-muted-foreground mb-4" />

      <h2 className="text-xl font-semibold mb-2">
        Aucun livre "{statusLabels[status]}"
      </h2>

      <p className="text-muted-foreground mb-6 max-w-sm">
        Vous n'avez pas de livre avec ce statut actuellement.
      </p>

      <Button variant="outline" onClick={onResetFilter}>
        Voir tous les livres
      </Button>
    </div>
  )
}
