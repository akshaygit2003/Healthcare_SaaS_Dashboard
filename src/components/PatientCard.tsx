import type { Patient } from '../data/patients';

type PatientCardProps = {
  patient: Patient;
};

const riskStyles: Record<Patient['riskLevel'], string> = {
  Low: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-rose-100 text-rose-700'
};

const PatientCard = ({ patient }: PatientCardProps) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{patient.name}</h3>
        <p className="text-sm text-slate-500">{patient.id}</p>
      </div>
      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${riskStyles[patient.riskLevel]}`}>
        {patient.riskLevel} Risk
      </span>
    </div>

    <dl className="mt-4 space-y-2 text-sm text-slate-600">
      <div className="flex justify-between">
        <dt>Condition</dt>
        <dd>{patient.condition}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Doctor</dt>
        <dd>{patient.assignedDoctor}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Phone</dt>
        <dd>{patient.phone}</dd>
      </div>
      <div className="flex justify-between">
        <dt>DOB</dt>
        <dd>{patient.dob}</dd>
      </div>
    </dl>
  </article>
);

export default PatientCard;
