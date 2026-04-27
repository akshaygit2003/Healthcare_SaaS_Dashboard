import type { Patient } from '../data/patients';

type PatientRowProps = {
  patient: Patient;
};

const riskStyles: Record<Patient['riskLevel'], string> = {
  Low: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-rose-100 text-rose-700'
};

const PatientRow = ({ patient }: PatientRowProps) => (
  <tr className="border-b border-slate-100 text-sm text-slate-700">
    <td className="px-4 py-3 font-medium text-slate-900">{patient.name}</td>
    <td className="px-4 py-3">{patient.condition}</td>
    <td className="px-4 py-3">{patient.assignedDoctor}</td>
    <td className="px-4 py-3">{patient.phone}</td>
    <td className="px-4 py-3">{patient.dob}</td>
    <td className="px-4 py-3">
      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${riskStyles[patient.riskLevel]}`}>
        {patient.riskLevel}
      </span>
    </td>
  </tr>
);

export default PatientRow;
