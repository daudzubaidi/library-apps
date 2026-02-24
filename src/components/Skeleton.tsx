interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-[8px] bg-[var(--color-neutral-200)] ${className}`} />
  );
}

export function BookCardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-[12px] overflow-hidden rounded-[12px] border border-solid border-[var(--color-neutral-200)] bg-white p-[16px]">
      <Skeleton className="h-[240px] w-full rounded-[8px]" />
      <div className="flex flex-col gap-[8px]">
        <Skeleton className="h-[20px] w-3/4" />
        <Skeleton className="h-[16px] w-1/2" />
        <div className="flex items-center justify-between mt-[4px]">
          <Skeleton className="h-[14px] w-[48px]" />
          <Skeleton className="h-[14px] w-[64px]" />
        </div>
      </div>
    </div>
  );
}

export function BookDetailSkeleton() {
  return (
    <div className="flex w-full flex-col gap-[64px]">
      <div className="flex flex-col gap-[24px]">
        <div className="flex items-center gap-[4px]">
          <Skeleton className="h-[16px] w-[40px]" />
          <Skeleton className="h-[16px] w-[16px]" />
          <Skeleton className="h-[16px] w-[80px]" />
          <Skeleton className="h-[16px] w-[16px]" />
          <Skeleton className="h-[16px] w-[120px]" />
        </div>

        <div className="flex flex-col gap-[24px] md:flex-row md:gap-[36px]">
          <Skeleton className="h-[300px] w-full rounded-[8px] md:h-[498px] md:w-[337px] md:shrink-0" />
          <div className="flex flex-1 flex-col gap-[20px]">
            <div className="flex flex-col gap-[8px]">
              <Skeleton className="h-[28px] w-[100px] rounded-[100px]" />
              <Skeleton className="h-[44px] w-3/4" />
              <Skeleton className="h-[28px] w-1/2" />
              <Skeleton className="h-[28px] w-[80px]" />
            </div>
            <div className="flex gap-[20px] border-y border-[var(--color-neutral-200)] py-[16px]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-[4px]">
                  <Skeleton className="h-[40px] w-[48px]" />
                  <Skeleton className="h-[16px] w-[48px]" />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-[8px]">
              <Skeleton className="h-[24px] w-[120px]" />
              <Skeleton className="h-[16px] w-full" />
              <Skeleton className="h-[16px] w-5/6" />
              <Skeleton className="h-[16px] w-4/6" />
            </div>
            <Skeleton className="h-[48px] w-[160px] rounded-[100px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoanCardSkeleton() {
  return (
    <div className="flex gap-[24px] rounded-[12px] border border-solid border-[var(--color-neutral-200)] bg-white p-[24px]">
      <Skeleton className="h-[180px] w-[120px] shrink-0 rounded-[8px]" />
      <div className="flex flex-1 flex-col gap-[12px]">
        <Skeleton className="h-[28px] w-[100px] rounded-[100px]" />
        <Skeleton className="h-[24px] w-3/4" />
        <Skeleton className="h-[18px] w-1/2" />
        <div className="flex gap-[24px]">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-[4px]">
              <Skeleton className="h-[14px] w-[64px]" />
              <Skeleton className="h-[18px] w-[80px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="rounded-[12px] border border-solid border-[var(--color-neutral-200)] bg-white p-[24px]">
      <div className="mb-[16px] flex gap-[16px]">
        <Skeleton className="h-[100px] w-[66px] shrink-0 rounded-[8px]" />
        <div className="flex flex-1 flex-col gap-[8px]">
          <Skeleton className="h-[20px] w-3/4" />
          <Skeleton className="h-[16px] w-[80px]" />
          <Skeleton className="h-[14px] w-[60px]" />
        </div>
      </div>
      <Skeleton className="h-[14px] w-full" />
      <Skeleton className="mt-[4px] h-[14px] w-4/5" />
    </div>
  );
}
