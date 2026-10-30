import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[560px] rounded-[2rem] lg:h-[600px]" />
      <Skeleton className="h-14" />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] rounded-[1.4rem]" />
        ))}
      </div>
    </div>
  );
}
