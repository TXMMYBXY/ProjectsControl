import { useState } from 'react';
import { CreateEmployeeViewModel, UpdateEmployeeViewModel, GetEmployeeViewModel, GetProjectViewModel } from '../../api';

interface EmployeeFormProps {
  initialData?: GetEmployeeViewModel;
  projects: GetProjectViewModel[];
  onSubmit: (data: CreateEmployeeViewModel | UpdateEmployeeViewModel) => Promise<void>;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

export function EmployeeForm({ initialData, projects, onSubmit, onCancel, mode }: EmployeeFormProps) {
  const [form, setForm] = useState({
    firstName: initialData?.firstName ?? '',
    lastName: initialData?.lastName ?? '',
    patronymic: initialData?.patronymic ?? '',
    email: initialData?.email ?? '',
    phoneNumber: initialData?.phoneNumber ?? '',
    projectsIds: initialData?.projects?.map(p => p.id) ?? [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: string, value: unknown) => setForm(f => ({ ...f, [field]: value }));

  const toggleProject = (id: number) => {
    setForm(f => ({
      ...f,
      projectsIds: f.projectsIds.includes(id)
        ? f.projectsIds.filter(p => p !== id)
        : [...f.projectsIds, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await onSubmit({
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined,
        patronymic: form.patronymic || null,
        email: form.email || null,
        phoneNumber: form.phoneNumber || null,
        projectsIds: form.projectsIds.length ? form.projectsIds : null,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Фамилия *</label>
          <input className={inputClass} required value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Иванов" />
        </div>
        <div>
          <label className={labelClass}>Имя *</label>
          <input className={inputClass} required value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Иван" />
        </div>
      </div>
      <div>
        <label className={labelClass}>Отчество</label>
        <input className={inputClass} value={form.patronymic} onChange={e => set('patronymic', e.target.value)} placeholder="Иванович" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" className={inputClass} value={form.email} onChange={e => set('email', e.target.value)} placeholder="ivan@example.com" />
        </div>
        <div>
          <label className={labelClass}>Телефон</label>
          <input className={inputClass} value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} placeholder="+7 999 123-45-67" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Проекты</label>
        <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto divide-y divide-gray-50">
          {projects.length === 0 && (
            <p className="text-xs text-gray-400 p-3">Нет доступных проектов</p>
          )}
          {projects.map(p => (
            <label key={p.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={form.projectsIds.includes(p.id)}
                onChange={() => toggleProject(p.id)}
                className="accent-indigo-600"
              />
              <span className="text-sm text-gray-700">{p.title}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium rounded-lg transition"
        >
          {loading ? 'Сохранение...' : mode === 'create' ? 'Добавить сотрудника' : 'Сохранить изменения'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition">
          Отмена
        </button>
      </div>
    </form>
  );
}
