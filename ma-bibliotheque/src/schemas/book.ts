import { z } from 'zod'

/**
 * Schema de validation pour les formulaires de livre
 * Utilise par React Hook Form pour la validation
 */
export const bookFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(200, 'Le titre ne peut pas depasser 200 caracteres'),
  author: z
    .string()
    .min(1, "L'auteur est requis")
    .max(100, "L'auteur ne peut pas depasser 100 caracteres"),
  status: z.enum(['to_read', 'reading', 'read']),
})

/**
 * Type infere du schema pour les donnees de formulaire
 */
export type BookFormData = z.infer<typeof bookFormSchema>

/**
 * Valeurs par defaut pour un nouveau livre
 */
export const defaultBookValues: BookFormData = {
  title: '',
  author: '',
  status: 'to_read',
}
