import { useState } from 'react';
import { projectsApi } from '../../api/index.js';
import { SearchableMultiSelect, SearchableSingleSelect } from '../ui/SearchableMultiSelect.jsx';
import {
  PROJECT_STATUS,
  PROJECT_STATUS_COLORS,
  OPTIONAL_TEAM_STATUSES,
  ALL_STATUSES,
} from '../../utils/projectStatus.js';

function isValidDate(iso) {
  if (!iso) return false;
  const year = parseInt(iso.slice(0, 4), 10);
  if (year <= 1) return false;
  return true;
}

function toDateOnly(iso) {
  if (!isValidDate(iso)) return '';
  return iso.slice(0, 10);
}

function dateToISO(dateStr) {
  if (!dateStr) return null;
  return `${dateStr}T00:00:00.000Z`;
}

function getEmpLabel(emp) {
  return [emp.lastName, emp.firstName, emp.patronymic].filter(Boolean).join(' ') || `Сотрудник #${emp.id}`;
}

function resolveStatus(status) {
  if (status === null || status === undefined) return PROJECT_STATUS.Backlog;
  if (typeof status === 'number') return status;
  const asNum = Number(status);
  if (!isNaN(asNum) && String(asNum) === String(status).trim()) return asNum;
  if (PROJECT_STATUS[status] !== undefined) return PROJECT_STATUS[status];
  return PROJECT_STATUS.Backlog;
}

export function ProjectForm({ initialData, employees, onSubmit, onCancel, mode }) {
  const initStatus = mode === 'create'
    ? PROJECT_STATUS.Backlog
    : resolveStatus(initialData?.status);

  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    customerCompany: initialData?.customerCompany ?? '',
    performingCompany: initialData?.performingCompany ?? '',
    startDate: toDateOnly(initialData?.startDate),
    endDate: toDateOnly(initialData?.endDate),
    priority: initialData?.priority ?? 0,
    status: initStatus,
    projectManagerId: initialData?.projectManager?.id ?? null,
    employeesIds: initialData?.employees?.map(e => e.id) ?? [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const teamOptional = OPTIONAL_TEAM_STATUSES.has(form.status);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!teamOptional) {
      if (!form.projectManagerId) {
        setError('Для выбранного статуса необходимо назначить руководителя проекта.');
        return;
      }
      if (form.employeesIds.length === 0) {
        setError('Для выбранного статуса необходимо добавить хотя бы одного сотрудника.');
        return;
      }
    }

    try {
      setLoading(true);

      if (mode === 'create') {
        await onSubmit({
          title: form.title,
          customerCompany: form.customerCompany,
          performingCompany: form.performingCompany,
          startDate: dateToISO(form.startDate) ?? new Date().toISOString(),
          finishDate: form.endDate ? dateToISO(form.endDate) : null,
          priority: Number(form.priority),
          status: Number(form.status),
          projectManagerId: form.projectManagerId ? Number(form.projectManagerId) : null,
          employeesIds: form.employeesIds.length > 0 ? form.employeesIds : null,
        });
      } else {
        const newMgrId = form.projectManagerId ? Number(form.projectManagerId) : null;
        const newEmpIds = form.employeesIds;

        await projectsApi.changeEmployees(initialData.id, {
          projectManagerId: newMgrId,
          employeesIds: newEmpIds,
          status: Number(form.status),
        });

        await projectsApi.update(initialData.id, {
          title: form.title || null,
          customerCompany: form.customerCompany || null,
          performingCompany: form.performingCompany || null,
          startDate: form.startDate ? dateToISO(form.startDate) : null,
          endDate: form.endDate ? dateToISO(form.endDate) : null,
          priority: form.priority !== undefined ? Number(form.priority) : null,
        });

        await onSubmit(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition';
  const labelClass = 'block text-xs font-medium text-gray-600 mb-1';

  const priorityColor =
    form.priority <= 3 ? 'text-emerald-600' :
    form.priority <= 6 ? 'text-yellow-600' :
    'text-red-600';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Название */}
      <div>
        <label className={labelClass}>Название проекта *</label>
        <input
          className={inputClass}
          required
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="Введите название"
        />
      </div>

      {/* Компании */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Компания-заказчик *</label>
          <input
            className={inputClass}
            required
            value={form.customerCompany}
            onChange={e => set('customerCompany', e.target.value)}
            placeholder="Заказчик"
          />
        </div>
        <div>
          <label className={labelClass}>Компания-исполнитель *</label>
          <input
            className={inputClass}
            required
            value={form.performingCompany}
            onChange={e => set('performingCompany', e.target.value)}
            placeholder="Исполнитель"
          />
        </div>
      </div>

      {/* Даты */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Дата начала *</label>
          <input
            type="date"
            className={inputClass}
            required={mode === 'create'}
            value={form.startDate}
            onChange={e => set('startDate', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Дата окончания</label>
          {form.endDate ? (
            <div className="flex items-center gap-2">
              <input
                type="date"
                className={`${inputClass} flex-1`}
                value={form.endDate}
                onChange={e => set('endDate', e.target.value)}
              />
              <button
                type="button"
                onClick={() => set('endDate', '')}
                title="Убрать дату окончания"
                className="shrink-0 flex items-center gap-1 px-2.5 py-2 text-xs text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg transition whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Убрать
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 text-sm border border-dashed border-gray-300 rounded-lg text-gray-400 bg-gray-50 select-none">
                — Не установлена
              </div>
              <button
                type="button"
                onClick={() => set('endDate', new Date().toISOString().slice(0, 10))}
                title="Указать дату окончания"
                className="shrink-0 flex items-center gap-1 px-2.5 py-2 text-xs text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Указать
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Приоритет */}
      <div>
        <label className={labelClass}>
          Приоритет:{' '}
          <span className={`font-semibold ${priorityColor}`}>{form.priority}</span>
        </label>
        <div className="flex items-center gap-3 mt-1">
          <input
            type="range"
            min={0}
            max={10}
            value={form.priority}
            onChange={e => set('priority', Number(e.target.value))}
            className="flex-1 accent-indigo-600"
          />
          <div className="flex gap-0.5">
            {[...Array(11)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-4 rounded-full transition ${
                  i <= form.priority
                    ? form.priority <= 3 ? 'bg-emerald-400'
                    : form.priority <= 6 ? 'bg-yellow-400'
                    : 'bg-red-400'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Статус */}
      <div>
        <label className={labelClass}>Статус проекта</label>
        <div className="grid grid-cols-3 gap-2">
          {ALL_STATUSES.map(({ value, label }) => {
            const colors = PROJECT_STATUS_COLORS[value];
            const selected = form.status === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => set('status', value)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition
                  ${selected
                    ? `${colors.bg} ${colors.text} ${colors.border} ring-2 ring-offset-1 ring-current`
                    : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${selected ? colors.dot : 'bg-gray-300'}`} />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Руководитель */}
      <div>
        <label className={labelClass}>
          Руководитель проекта
          {!teamOptional && <span className="ml-1 text-red-500">*</span>}
        </label>
        <SearchableSingleSelect
          items={employees}
          value={form.projectManagerId}
          onChange={id => set('projectManagerId', id)}
          placeholder="— Не назначен —"
          getId={e => e.id}
          getLabel={getEmpLabel}
        />
      </div>

      {/* Сотрудники */}
      <div>
        <label className={labelClass}>
          Сотрудники
          {!teamOptional && <span className="ml-1 text-red-500">*</span>}
        </label>
        <SearchableMultiSelect
          items={employees}
          selectedIds={form.employeesIds}
          onChange={ids => set('employeesIds', ids)}
          placeholder="Выберите сотрудников..."
          getId={e => e.id}
          getLabel={getEmpLabel}
        />
        {/* счётчик убран */}
      </div>

      {/* Кнопки */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium rounded-lg transition"
        >
          {loading ? 'Сохранение...' : mode === 'create' ? 'Создать проект' : 'Сохранить изменения'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
