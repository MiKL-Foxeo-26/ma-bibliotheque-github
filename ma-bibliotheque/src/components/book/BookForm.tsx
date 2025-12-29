import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { bookFormSchema, defaultBookValues, type BookFormData } from '@/schemas/book'

interface BookFormProps {
  /** Mode du formulaire - creation ou edition */
  mode: 'create' | 'edit'
  /** Valeurs initiales pour le mode edition */
  defaultValues?: BookFormData
  /** Callback lors de la soumission */
  onSubmit: (data: BookFormData) => void
  /** Callback pour annuler */
  onCancel: () => void
  /** Etat de chargement */
  isLoading?: boolean
}

/**
 * Formulaire de creation/edition de livre
 * Utilise React Hook Form + Zod pour la validation
 */
export function BookForm({
  mode,
  defaultValues = defaultBookValues,
  onSubmit,
  onCancel,
  isLoading = false,
}: BookFormProps) {
  const form = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    defaultValues,
  })

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champ Titre */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Le Petit Prince"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ Auteur */}
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Auteur</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Antoine de Saint-Exupery"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ Statut */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="to_read">A lire</SelectItem>
                  <SelectItem value="reading">En cours</SelectItem>
                  <SelectItem value="read">Lu</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Boutons d'action */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? 'Chargement...'
              : mode === 'create'
                ? 'Ajouter'
                : 'Sauvegarder'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
