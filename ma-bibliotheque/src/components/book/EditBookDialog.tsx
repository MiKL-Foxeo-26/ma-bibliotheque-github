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
import type { Book } from '@/types/book'
import type { BookFormData } from '@/schemas/book'

interface EditBookDialogProps {
  /** Livre a editer (null si ferme) */
  book: Book | null
  /** Callback pour fermer le dialog */
  onClose: () => void
  /** Callback lors de la soumission du formulaire */
  onSubmit: (bookId: string, data: BookFormData) => Promise<void>
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

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

/**
 * Dialog/Sheet responsive pour editer un livre
 * Utilise Sheet (slide-up) sur mobile, Dialog sur desktop
 */
export function EditBookDialog({
  book,
  onClose,
  onSubmit,
}: EditBookDialogProps) {
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)

  const isOpen = book !== null

  const handleSubmit = async (data: BookFormData) => {
    if (!book) return

    setIsLoading(true)
    try {
      await onSubmit(book.id, data)
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  // Valeurs par defaut pre-remplies avec les donnees du livre
  const defaultValues: BookFormData | undefined = book
    ? {
        title: book.title,
        author: book.author,
        status: book.status,
      }
    : undefined

  // Contenu commun du formulaire
  const formContent = defaultValues ? (
    <BookForm
      mode="edit"
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      onCancel={onClose}
      isLoading={isLoading}
    />
  ) : null

  // Mobile: Sheet slide-up
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent side="bottom" className="h-auto max-h-[90vh]">
          <SheetHeader className="mb-4">
            <SheetTitle>Modifier le livre</SheetTitle>
            <SheetDescription>
              Modifiez les informations du livre
            </SheetDescription>
          </SheetHeader>
          {formContent}
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: Dialog modal
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le livre</DialogTitle>
          <DialogDescription>
            Modifiez les informations du livre
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  )
}
