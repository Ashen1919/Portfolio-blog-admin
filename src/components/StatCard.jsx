export default function StatCard({ icon: Icon, label, count, colorClass, glowClass, bgClass }) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-2xl bg-white p-6 transition-all duration-200 hover:-translate-y-0.5',
        glowClass,
      ].join(' ')}
    >
      {/* Background blob */}
      <div
        className={[
          'absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 blur-2xl',
          bgClass,
        ].join(' ')}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
          <p className="mt-2 text-4xl font-bold text-ink">
            {count === null ? (
              <span className="inline-block h-9 w-16 animate-pulse rounded-lg bg-slate-200" />
            ) : (
              count
            )}
          </p>
        </div>
        <div className={['flex h-12 w-12 items-center justify-center rounded-xl', colorClass].join(' ')}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}
