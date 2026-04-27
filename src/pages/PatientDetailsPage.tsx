import { useEffect, useMemo, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaList, FaSort, FaSortDown, FaSortUp, FaThLarge } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PatientCard from '../components/PatientCard';
import PatientRow from '../components/PatientRow';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchPatients, setCurrentPage, setViewMode } from '../features/patients/patientsSlice';

const PatientDetailsPage = () => {
  const dispatch = useAppDispatch();
  const { data, viewMode, loading, error, currentPage, total, limit } = useAppSelector(
    (state) => state.patients
  );
  const [sortField, setSortField] = useState<'name' | 'dob' | 'risk'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const totalPages = Math.min(10, Math.max(1, Math.ceil(total / limit)));

  useEffect(() => {
    void dispatch(fetchPatients({ page: currentPage }));
  }, [currentPage, dispatch]);

  const handleSetGridView = () => {
    dispatch(setViewMode('grid'));
  };

  const handleSetListView = () => {
    dispatch(setViewMode('list'));
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    dispatch(setCurrentPage(page));
  };

  const handleSortChange = (field: 'name' | 'dob' | 'risk') => {
    if (sortField === field) {
      setSortOrder((previousOrder) => (previousOrder === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortField(field);
    setSortOrder('asc');
  };

  const sortedPatients = useMemo(() => {
    const patientsCopy = [...data];

    if (sortField === 'name') {
      patientsCopy.sort((firstPatient, secondPatient) => {
        const value = firstPatient.name.localeCompare(secondPatient.name);
        return sortOrder === 'asc' ? value : -value;
      });
      return patientsCopy;
    }

    if (sortField === 'risk') {
      const riskPriority = { Low: 1, Medium: 2, High: 3 };
      patientsCopy.sort((firstPatient, secondPatient) => {
        const value = riskPriority[firstPatient.riskLevel] - riskPriority[secondPatient.riskLevel];
        return sortOrder === 'asc' ? value : -value;
      });
      return patientsCopy;
    }

    patientsCopy.sort((firstPatient, secondPatient) => {
      const firstDate = new Date(firstPatient.dob).getTime();
      const secondDate = new Date(secondPatient.dob).getTime();
      const value = firstDate - secondDate;
      return sortOrder === 'asc' ? value : -value;
    });

    return patientsCopy;
  }, [data, sortField, sortOrder]);

  const getSortIcon = (field: 'name' | 'dob' | 'risk') => {
    if (sortField !== field) {
      return <FaSort className="text-slate-400" />;
    }

    if (sortOrder === 'asc') {
      return <FaSortUp className="text-sky-600" />;
    }

    return <FaSortDown className="text-sky-600" />;
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Details</h1>
          <p className="text-sm text-slate-500">Switch between grid and list views for patient records.</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-1" role="group" aria-label="Toggle patient view">
          <button
            type="button"
            onClick={handleSetGridView}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
              viewMode === 'grid' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Switch to grid view"
          >
            <FaThLarge />
            Grid View
          </button>
          <button
            type="button"
            onClick={handleSetListView}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
              viewMode === 'list' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Switch to list view"
          >
            <FaList />
            List View
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
        <span className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Sort By</span>
        <button
          type="button"
          onClick={() => handleSortChange('name')}
          className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
            sortField === 'name' ? 'bg-sky-100 text-sky-700' : 'text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="Sort by name"
        >
          Name
          {getSortIcon('name')}
        </button>
        <button
          type="button"
          onClick={() => handleSortChange('dob')}
          className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
            sortField === 'dob' ? 'bg-sky-100 text-sky-700' : 'text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="Sort by date of birth"
        >
          DOB
          {getSortIcon('dob')}
        </button>
        <button
          type="button"
          onClick={() => handleSortChange('risk')}
          className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
            sortField === 'risk' ? 'bg-sky-100 text-sky-700' : 'text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="Sort by risk level"
        >
          Risk
          {getSortIcon('risk')}
        </button>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading patients...</p>}
      {error && <p className="text-sm text-rose-600">{error}</p>}

      {loading && viewMode === 'grid' && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`patient-grid-skeleton-${index}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Skeleton height={24} width="65%" />
              <div className="mt-3">
                <Skeleton count={4} />
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && viewMode === 'list' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={`patient-list-skeleton-${index}`} className="mb-3 last:mb-0">
              <Skeleton height={18} />
            </div>
          ))}
        </div>
      )}

      {!loading &&
        !error &&
        (viewMode === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sortedPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleSortChange('name')}
                        className="inline-flex items-center gap-2"
                        aria-label="Sort table by patient name"
                      >
                        Patient
                        {getSortIcon('name')}
                      </button>
                    </th>
                    <th className="px-4 py-3">Condition</th>
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleSortChange('dob')}
                        className="inline-flex items-center gap-2"
                        aria-label="Sort table by date of birth"
                      >
                        DOB
                        {getSortIcon('dob')}
                      </button>
                    </th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleSortChange('risk')}
                        className="inline-flex items-center gap-2"
                        aria-label="Sort table by risk level"
                      >
                        Risk
                        {getSortIcon('risk')}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPatients.map((patient) => (
                    <PatientRow key={patient.id} patient={patient} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

      <footer className="flex flex-wrap items-center gap-2" aria-label="Patient pagination">
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Go to previous page"
        >
          <FaChevronLeft size={12} />
          Previous
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => handlePageChange(page)}
            disabled={loading}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              page === currentPage
                ? 'bg-sky-600 text-white'
                : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Go to next page"
        >
          Next
          <FaChevronRight size={12} />
        </button>
      </footer>
    </section>
  );
};

export default PatientDetailsPage;
