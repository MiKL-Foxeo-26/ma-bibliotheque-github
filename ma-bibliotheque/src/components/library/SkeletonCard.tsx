import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonCard() {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-3" />
      <Skeleton className="h-6 w-16" />
    </div>
  )
}

export function BookListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}
