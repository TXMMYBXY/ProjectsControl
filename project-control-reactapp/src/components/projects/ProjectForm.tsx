import { useState } from 'react';
import { CreateProjectViewModel, UpdateProjectViewModel, GetProjectViewModel, GetEmployeeViewModel } from '../../api';

interface ProjectFormProps {
  initialData?: GetProjectViewModel;
  employees: GetEmployeeViewModel[];
  onSubmit: (data: CreateProjectViewModel | UpdateProjectViewModel) => Promise<void>;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

function toDatetimeLocal(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ProjectForm({ initialData, employees, onSubmit, onCancel, mode }: ProjectFormProps) {
  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    customerCompany: initialData?.customerCompany ?? '',
    performingCompany: initialData?.performingCompany ?? '',
    startDate: toDatetimeLocal(initialData?.startDate),
    endDate: toDatetimeLocal(initialData?.endDate),
    priority: initialData?.priority ?? 0,
    projectManagerId: initialData?.projectManager?.id ?? '',
    employeesIds: initialData?.employees?.map(e => e.id) ?? [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: string, value: unknown) => setForm(f => ({ ...f, [field]: value }));

  const toggleEmployee = (id: number) => {
    setForm(f => ({
      ...f,
      employeesIds: f.employeesIds.includes(id)
        ? f.employeesIds.filter(e => e !== id)
        : [...f.employeesIds, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
          employeesIds: form.employeesIds,
        } as CreateProjectViewModel);
      } else {
        await onSubmit({
          title: form.title || null,
          customerCompany: form.customerCompany || null,
          performingCompany: form.performingCompany || null,
          startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
          endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
          priority: form.priority !== undefined ? Number(form.priority) : null,
        } as UpdateProjectViewModel);
      }
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

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className={labelClass}>Название проекта *</label>
          <input className={inputClass} required value={form.title} onChange={e => set('title', e.target.value)} placeholder="Введите название" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Компания-заказчик *</label>
            <input className={inputClass} required value={form.customerCompany} onChange={e => set('customerCompany', e.target.value)} placeholder="Заказчик" />
          </div>
          <div>
            <label className={labelClass}>Компания-исполнитель *</label>
            <input className={inputClass} required value={form.performingCompany} onChange={e => set('performingCompany', e.target.value)} placeholder="Исполнитель" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Дата начала *</label>
            <input type="datetime-local" className={inputClass} required={mode === 'create'} value={form.startDate} onChange={e => set('startDate', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Дата окончания</label>
            <input type="datetime-local" className={inputClass} value={form.endDate} onChange={e => set('endDate', e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Приоритет (0 — низкий, 10 — высокий)</label>
          <div className="flex items-center gap-3">
            <input type="range" min={0} max={10} value={form.priority} onChange={e => set('priority', Number(e.target.value))} className="flex-1 accent-indigo-600" />
            <span className="w-6 text-center text-sm font-semibold text-indigo-600">{form.priority}</span>
          </div>
        </div>

        {mode === 'create' && (
          <>
            <div>
              <label className={labelClass}>Руководитель проекта</label>
              <select className={inputClass} value={form.projectManagerId} onChange={e => set('projectManagerId', e.target.value)}>
                <option value="">— Не назначен —</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.lastName} {emp.firstName} {emp.patronymic ?? ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Сотрудники</label>
              <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto divide-y divide-gray-50">
                {employees.length === 0 && (
                  <p className="text-xs text-gray-400 p-3">Нет доступных сотрудников</p>
                )}
                {employees.map(emp => (
                  <label key={emp.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.employeesIds.includes(emp.id)}
                      onChange={() => toggleEmployee(emp.id)}
                      className="accent-indigo-600"
                    />
                    <span className="text-sm text-gray-700">
                      {emp.lastName} {emp.firstName} {emp.patronymic ?? ''}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </>
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
        <button type="button" onClick={onCancel} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition">
          Отмена
        </button>
      </div>
    </form>
  );
}
