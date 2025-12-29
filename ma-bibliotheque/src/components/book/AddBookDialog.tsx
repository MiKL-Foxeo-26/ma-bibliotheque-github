import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { BookForm } from './BookForm'
import type { BookFormData } from '@/schemas/book'

interface AddBookDialogProps {
  /** Etat d'ouverture du dialog */
  open: boolean
  /** Callback pour fermer le dialog */
  onOpenChange: (open: boolean) => void
  /** Callback lors de la soumission du formulaire */
  onSubmit: (data: BookFormData) => Promise<void>
}

/**
 * Hook pour detecter si on est sur mobile (< 640px)
 */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    // Check initial
    checkMobile()

    // Ecouter les changements de taille
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

/**
 * Dialog/Sheet responsive pour ajouter un livre
 * Utilise Sheet (slide-up) sur mobile, Dialog sur desktop
 */
export function AddBookDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddBookDialogProps) {
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: BookFormData) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  // Contenu commun du formulaire
  const formContent = (
    <BookForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  )

  // Mobile: Sheet slide-up
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-auto max-h-[90vh]">
          <SheetHeader className="mb-4">
            <SheetTitle>Ajouter un livre</SheetTitle>
            <SheetDescription>
              Remplissez les informations du livre a ajouter
            </SheetDescription>
          </SheetHeader>
          {formContent}
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: Dialog modal
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un livre</DialogTitle>
          <DialogDescription>
            Remplissez les informations du livre a ajouter
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  )
}
