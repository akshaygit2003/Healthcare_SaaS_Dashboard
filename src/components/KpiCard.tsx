type KpiCardProps = {
  title: string;
  value: string;
  delta: string;
};

const KpiCard = ({ title, value, delta }: KpiCardProps) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-sm text-slate-500">{title}</p>
    <h3 className="mt-2 text-2xl font-semibold text-slate-900">{value}</h3>
    <p className="mt-1 text-sm text-emerald-600">{delta}</p>
  </article>
);

export default KpiCard;
