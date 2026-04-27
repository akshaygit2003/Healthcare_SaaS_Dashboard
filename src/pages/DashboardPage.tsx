import { useState } from 'react';
import KpiCard from '../components/KpiCard';
import { askNotificationPermission, triggerReminderNotification } from '../services/notifications';

const DashboardPage = () => {
  const [notificationStatus, setNotificationStatus] = useState('');

  const handleEnableNotifications = async () => {
    const permission = await askNotificationPermission();

    if (permission === 'granted') {
      setNotificationStatus('Notifications enabled successfully.');
      return;
    }

    if (permission === 'denied') {
      setNotificationStatus('Notification permission denied by browser.');
      return;
    }

    setNotificationStatus('Notifications are not supported in this browser.');
  };

  const handleSendReminder = async () => {
    try {
      await triggerReminderNotification();
      setNotificationStatus('Medication reminder notification sent.');
    } catch (error) {
      setNotificationStatus(error instanceof Error ? error.message : 'Unable to send notification.');
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Healthcare operations snapshot for today.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total Patients" value="1,284" delta="+4.1% this month" />
        <KpiCard title="Appointments Today" value="56" delta="+9 new bookings" />
        <KpiCard title="Critical Cases" value="12" delta="-2 vs last week" />
        <KpiCard title="Doctor Availability" value="93%" delta="Stable utilization" />
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enable browser notifications and trigger a local medication reminder.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleEnableNotifications}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Enable Notifications
          </button>
          <button
            type="button"
            onClick={handleSendReminder}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Send Medication Reminder
          </button>
        </div>
        {notificationStatus && <p className="mt-3 text-sm text-sky-700">{notificationStatus}</p>}
      </article>
    </section>
  );
};

export default DashboardPage;
