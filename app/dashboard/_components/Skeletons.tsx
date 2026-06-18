// src/app/dashboard/_components/Skeletons.tsx

export function BlockSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
      {/* Injection locale de l'animation de balayage (Shimmer) pour éviter de modifier tailwind.config */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `,
        }}
      />

      {/* Effet de balayage brillant (Shimmer Effect) */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-100/80 to-transparent" />

      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="h-5 w-32 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-4 w-12 animate-pulse rounded-md bg-slate-100" />
      </div>

      <div className="mt-5 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
