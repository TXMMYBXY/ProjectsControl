import { useState } from 'react';
import { projectsApi } from '../../api/index.js';
import { SearchableMultiSelect, SearchableSingleSelect } from '../ui/SearchableMultiSelect.jsx';

function toDatetimeLocal(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getEmpLabel(emp) {
  return [emp.lastName, emp.firstName, emp.patronymic].filter(Boolean).join(' ') || `Сотрудник #${emp.id}`;
}

export function ProjectForm({ initialData, employees, onSubmit, onCancel, mode }) {
  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    customerCompany: initialData?.customerCompany ?? '',
    performingCompany: initialData?.performingCompany ?? '',
    startDate: toDatetimeLocal(initialData?.startDate),
    endDate: toDatetimeLocal(initialData?.endDate),
    priority: initialData?.priority ?? 0,
    projectManagerId: initialData?.projectManager?.id ?? null,
    employeesIds: initialData?.employees?.map(e => e.id) ?? [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);

      if (mode === 'create') {
        await onSubmit({
          title: form.title,
          customerCompany: form.customerCompany,
          performingCompany: form.performingCompany,
          startDate: form.startDate ? new Date(form.startDate).toISOString() : new Date().toISOString(),
          finishDate: form.endDate ? new Date(form.endDate).toISOString() : null,
          priority: Number(form.priority),
          projectManagerId: form.projectManagerId ? Number(form.projectManagerId) : null,
          employeesIds: form.employeesIds.length ? form.employeesIds : null,
        });
      } else {
        // Шаг 1: обновляем основные поля проекта
        await projectsApi.update(initialData.id, {
          title: form.title || null,
          customerCompany: form.customerCompany || null,
          performingCompany: form.performingCompany || null,
          startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
          endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
          priority: form.priority !== undefined ? Number(form.priority) : null,
        });

        // Шаг 2: обновляем сотрудников и руководителя через отдельный эндпоинт
        const prevEmpIds = initialData?.employees?.map(e => e.id) ?? [];
        const newEmpIds = form.employeesIds;
        const prevMgrId = initialData?.projectManager?.id ?? null;
        const newMgrId = form.projectManagerId ? Number(form.projectManagerId) : null;

        const empChanged =
          prevEmpIds.length !== newEmpIds.length ||
          !prevEmpIds.every(id => newEmpIds.includes(id));
        const mgrChanged = prevMgrId !== newMgrId;

        if (empChanged || mgrChanged) {
          await projectsApi.changeEmployees(initialData.id, {
            projectManagerId: newMgrId,
            employeesIds: newEmpIds,
          });
        }

        await onSubmit(null); // сигнал что всё выполнено внутри
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition';
  const labelClass = 'block text-xs font-medium text-gray-600 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
      )}

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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Дата начала *</label>
          <input
            type="datetime-local"
            className={inputClass}
            required={mode === 'create'}
            value={form.startDate}
            onChange={e => set('startDate', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Дата окончания</label>
          <input
            type="datetime-local"
            className={inputClass}
            value={form.endDate}
            onChange={e => set('endDate', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Приоритет: <span className="text-indigo-600 font-semibold">{form.priority}</span> (0 — низкий, 10 — высокий)</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={10}
            value={form.priority}
            onChange={e => set('priority', Number(e.target.value))}
            className="flex-1 accent-indigo-600"
          />
          <div className="flex gap-1">
            {[...Array(11)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-4 rounded-full transition ${i <= form.priority
                  ? form.priority <= 3 ? 'bg-green-400'
                  : form.priority <= 6 ? 'bg-yellow-400'
                  : 'bg-red-400'
                  : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Руководитель проекта
          {mode === 'edit' && <span className="ml-2 text-indigo-500 font-normal">(сохраняется отдельно)</span>}
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

      <div>
        <label className={labelClass}>
          Сотрудники
          {mode === 'edit' && <span className="ml-2 text-indigo-500 font-normal">(сохраняются отдельно)</span>}
        </label>
        <SearchableMultiSelect
          items={employees}
          selectedIds={form.employeesIds}
          onChange={ids => set('employeesIds', ids)}
          placeholder="Выберите сотрудников..."
          getId={e => e.id}
          getLabel={getEmpLabel}
        />
        {form.employeesIds.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">Выбрано: {form.employeesIds.length} сотрудник{form.employeesIds.length === 1 ? '' : 'ов'}</p>
        )}
      </div>

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
