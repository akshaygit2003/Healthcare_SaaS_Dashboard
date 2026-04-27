const AnalyticsPage = () => {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500">Operational performance and treatment trend indicators.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">Patient Volume Trend</h2>
          <div className="mt-4 h-56 rounded-lg bg-linear-to-r from-sky-50 to-indigo-50 p-4">
            <div className="flex h-full items-end justify-between gap-2">
              {[42, 48, 51, 57, 54, 60, 63].map((value, index) => (
                <div key={value} className="flex w-full flex-col items-center gap-2">
                  <div className="w-full rounded-t bg-sky-500" style={{ height: `${value * 2}px` }} />
                  <span className="text-xs text-slate-500">W{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Department Load</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex justify-between">
              <span className="text-slate-600">Cardiology</span>
              <span className="font-medium text-slate-900">78%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">General Medicine</span>
              <span className="font-medium text-slate-900">64%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">Pulmonology</span>
              <span className="font-medium text-slate-900">52%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">Nephrology</span>
              <span className="font-medium text-slate-900">47%</span>
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
};

export default AnalyticsPage;
