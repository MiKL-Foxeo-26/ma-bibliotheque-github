import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { BookStatus } from '@/types/book'

interface StatusBadgeProps {
  status: BookStatus
  onChange?: (status: BookStatus) => void
  interactive?: boolean
}

const statusConfig: Record<BookStatus, { label: string; className: string }> = {
  to_read: {
    label: 'A lire',
    // Rose pale - style Five Pathways
    className: 'bg-muted text-muted-foreground border-border hover:bg-muted/80 shadow-[2px_2px_0_0_#1a1a1a] transition-all duration-200',
  },
  reading: {
    label: 'En cours',
    // Jaune pale - style Five Pathways
    className: 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80 shadow-[2px_2px_0_0_#1a1a1a] transition-all duration-200',
  },
  read: {
    label: 'Lu',
    // Vert pale - style Five Pathways
    className: 'bg-accent text-accent-foreground border-border hover:bg-accent/80 shadow-[2px_2px_0_0_#1a1a1a] transition-all duration-200',
  },
}

const statusOptions: BookStatus[] = ['to_read', 'reading', 'read']

export function StatusBadge({
  status,
  onChange,
  interactive = true,
}: StatusBadgeProps) {
  const config = statusConfig[status]

  // Non-interactif : juste afficher le badge
  if (!interactive || !onChange) {
    return (
      <Badge variant="outline" className={cn('cursor-default', config.className)}>
        {config.label}
      </Badge>
    )
  }

  // Interactif : dropdown pour changer le statut
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="outline"
          className={cn('cursor-pointer', config.className)}
          role="combobox"
          aria-expanded="false"
          aria-haspopup="listbox"
          aria-label={`Changer le statut, actuellement: ${config.label}`}
        >
          {config.label}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onChange(option)}
            className={cn(
              option === status && 'bg-accent font-medium'
            )}
          >
            <span
              className={cn(
                'mr-2 h-2 w-2 rounded-full',
                option === 'to_read' && 'bg-muted-foreground',
                option === 'reading' && 'bg-secondary',
                option === 'read' && 'bg-primary'
              )}
            />
            {statusConfig[option].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
