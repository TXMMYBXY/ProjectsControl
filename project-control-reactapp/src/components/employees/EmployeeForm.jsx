import { useState } from 'react';
import { employeesApi } from '../../api/index.js';
import { SearchableMultiSelect } from '../ui/SearchableMultiSelect.jsx';

export function EmployeeForm({ initialData, projects, onSubmit, onCancel, mode }) {
  const [form, setForm] = useState({
    firstName: initialData?.firstName ?? '',
    lastName: initialData?.lastName ?? '',
    patronymic: initialData?.patronymic ?? '',
    email: initialData?.email ?? '',
    phoneNumber: initialData?.phoneNumber ?? '',
    projectsIds: initialData?.projects?.map(p => p.id) ?? [],
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
          firstName: form.firstName,
          lastName: form.lastName,
          patronymic: form.patronymic || null,
          email: form.email || null,
          phoneNumber: form.phoneNumber || null,
          projectsIds: form.projectsIds.length ? form.projectsIds : null,
        });
      } else {
        await employeesApi.update(initialData.id, {
          firstName: form.firstName || null,
          lastName: form.lastName || null,
          patronymic: form.patronymic || null,
          email: form.email || null,
          phoneNumber: form.phoneNumber || null,
        });

        const prevIds = initialData?.projects?.map(p => p.id) ?? [];
        const newIds = form.projectsIds;
        const changed =
          prevIds.length !== newIds.length ||
          !prevIds.every(id => newIds.includes(id));

        if (changed) {
          await employeesApi.changeProjects(initialData.id, {
            projectsIds: newIds,
          });
        }

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Фамилия *</label>
          <input
            className={inputClass}
            required
            value={form.lastName}
            onChange={e => set('lastName', e.target.value)}
            placeholder="Иванов"
          />
        </div>
        <div>
          <label className={labelClass}>Имя *</label>
          <input
            className={inputClass}
            required
            value={form.firstName}
            onChange={e => set('firstName', e.target.value)}
            placeholder="Иван"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Отчество</label>
        <input
          className={inputClass}
          value={form.patronymic}
          onChange={e => set('patronymic', e.target.value)}
          placeholder="Иванович"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="ivan@example.com"
          />
        </div>
        <div>
          <label className={labelClass}>Телефон</label>
          <input
            className={inputClass}
            value={form.phoneNumber}
            onChange={e => set('phoneNumber', e.target.value)}
            placeholder="+7 999 123-45-67"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Проекты
          {mode === 'edit' && (
            <span className="ml-2 text-indigo-500 font-normal">(обновляются отдельным запросом)</span>
          )}
        </label>
        <SearchableMultiSelect
          items={projects}
          selectedIds={form.projectsIds}
          onChange={ids => set('projectsIds', ids)}
          placeholder="Выберите проекты..."
          getId={p => p.id}
          getLabel={p => p.title ?? `Проект #${p.id}`}
        />
        {form.projectsIds.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            Выбрано: {form.projectsIds.length} проект{form.projectsIds.length === 1 ? '' : form.projectsIds.length < 5 ? 'а' : 'ов'}
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium rounded-lg transition"
        >
          {loading ? 'Сохранение...' : mode === 'create' ? 'Добавить сотрудника' : 'Сохранить изменения'}
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
