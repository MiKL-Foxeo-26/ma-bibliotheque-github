import { BookPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyLibraryProps {
  onAddBook: () => void
}

export function EmptyLibrary({ onAddBook }: EmptyLibraryProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4 text-center">
      {/* Composition moderne - cartes empilées */}
      <div className="mb-8 relative w-32 h-28">
        {/* Carte arrière gauche */}
        <div className="absolute left-0 top-2 w-20 h-24 rounded-lg bg-muted/30 border border-border/50 -rotate-12" />
        {/* Carte arrière droite */}
        <div className="absolute right-0 top-2 w-20 h-24 rounded-lg bg-muted/40 border border-border/50 rotate-12" />
        {/* Carte principale au centre */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-20 h-24 rounded-lg bg-card border-2 border-dashed border-primary/40 flex items-center justify-center">
          <BookPlus className="w-8 h-8 text-primary/60" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-2">
        Votre bibliotheque est vide
      </h2>

      <p className="text-muted-foreground mb-6 max-w-sm">
        Ajoutez votre premier livre pour commencer votre collection
      </p>

      <Button onClick={onAddBook} size="lg">
        <BookPlus className="mr-2 h-5 w-5" />
        Ajouter un livre
      </Button>
    </div>
  )
}
