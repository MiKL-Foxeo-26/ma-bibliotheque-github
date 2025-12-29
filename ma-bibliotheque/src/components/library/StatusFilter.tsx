import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import type { BookStatus } from '@/types/book'

export type FilterValue = BookStatus | 'all'

interface StatusFilterProps {
  value: FilterValue
  onChange: (value: FilterValue) => void
  counts: {
    all: number
    to_read: number
    reading: number
    read: number
  }
}

const filterOptions: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'to_read', label: 'A lire' },
  { value: 'reading', label: 'En cours' },
  { value: 'read', label: 'Lu' },
]

export function StatusFilter({ value, onChange, counts }: StatusFilterProps) {
  return (
    <div className="pt-1 pb-2 pr-2">
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(newValue) => {
          // Prevent deselection - always have a value
          if (newValue) {
            onChange(newValue as FilterValue)
          }
        }}
        className="justify-start flex-wrap gap-2"
        aria-label="Filtrer par statut"
      >
      {filterOptions.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={`${option.label} (${counts[option.value]} livres)`}
          className={cn(
            'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
            'px-3 py-2'
          )}
        >
          {option.label}
          <span className="ml-1.5 text-xs opacity-70">
            ({counts[option.value]})
          </span>
        </ToggleGroupItem>
      ))}
      </ToggleGroup>
    </div>
  )
}
