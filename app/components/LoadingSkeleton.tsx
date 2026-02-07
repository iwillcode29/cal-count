export default function LoadingSkeleton() {
  return (
    <div className="animate-fade-in">
      {/* Header: App title */}
      <div className="flex flex-col items-center pt-10 pb-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="shimmer h-3 w-16 rounded-full" />
          <span className="text-text-muted/30">|</span>
          <div className="shimmer h-3 w-12 rounded-full" />
        </div>

        {/* Date navigation */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-10 h-10 rounded-full shimmer" />
          <div className="shimmer h-5 w-[110px] rounded-full" />
          <div className="w-10 h-10 rounded-full shimmer" />
        </div>

        {/* Calorie ring */}
        <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
          <svg width={180} height={180} className="-rotate-90">
            <circle
              cx={90}
              cy={90}
              r={82}
              fill="none"
              stroke="var(--color-surface-lighter)"
              strokeWidth={8}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="shimmer h-8 w-20 rounded-lg" />
            <div className="shimmer h-3 w-24 rounded-full" />
          </div>
        </div>

        {/* Goal button */}
        <div className="mt-6 shimmer h-8 w-40 rounded-full" />
      </div>

      {/* Nutrition dashboard */}
      <div className="w-full mx-auto mb-6">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="shimmer h-3 w-24 rounded-full" />
          <div className="shimmer h-3 w-10 rounded-full" />
        </div>

        <div className="glass-card rounded-2xl p-5 mb-3">
          {/* Balance bar */}
          <div className="h-3 rounded-full overflow-hidden flex mb-4 bg-surface-lighter">
            <div className="shimmer w-full h-full" />
          </div>

          {/* 3 macro cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              "rgba(76,175,130,0.15)",
              "rgba(212,114,92,0.15)",
              "rgba(212,168,67,0.15)",
            ].map((bg, i) => (
              <div
                key={i}
                className="rounded-xl p-3"
                style={{ backgroundColor: bg }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="shimmer h-2.5 w-10 rounded-full" />
                  <div className="shimmer h-3 w-3 rounded-full" />
                </div>
                <div className="shimmer h-6 w-12 rounded-lg mb-1.5" />
                <div className="shimmer h-2.5 w-14 rounded-full mb-2" />
                <div className="h-1 bg-white/40 rounded-full overflow-hidden">
                  <div className="shimmer h-full w-1/2 rounded-full" />
                </div>
                <div className="shimmer h-2 w-8 rounded-full mt-1.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Goals button */}
        <div className="shimmer h-10 w-full rounded-xl" />
      </div>

      {/* Meal sections header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="shimmer h-3.5 w-28 rounded-full" />
          <div className="flex items-center gap-3">
            <div className="shimmer h-3 w-14 rounded-full" />
            <div className="shimmer h-3 w-14 rounded-full" />
          </div>
        </div>

        {/* 3 meal cards */}
        <div className="flex flex-col lg:flex-row gap-4">
          {[
            "from-amber-500/10 to-orange-500/10 border-amber-500/20",
            "from-sky-500/10 to-blue-500/10 border-sky-500/20",
            "from-purple-500/10 to-indigo-500/10 border-purple-500/20",
          ].map((color, i) => (
            <div
              key={i}
              className={`rounded-3xl border bg-gradient-to-br ${color} p-4 mb-4 lg:w-1/3`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="shimmer h-7 w-7 rounded-lg" />
                  <div className="shimmer h-4 w-16 rounded-full" />
                </div>
                <div className="shimmer h-3.5 w-14 rounded-full" />
              </div>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="shimmer h-3 w-28 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add food form */}
      <div className="sticky bottom-4">
        <div className="flex gap-2">
          <div className="shimmer h-[46px] w-[100px] rounded-2xl shrink-0" />
          <div className="shimmer h-[46px] flex-1 rounded-2xl" />
          <div className="shimmer h-[46px] w-[60px] rounded-2xl shrink-0" />
        </div>
      </div>
    </div>
  );
}
