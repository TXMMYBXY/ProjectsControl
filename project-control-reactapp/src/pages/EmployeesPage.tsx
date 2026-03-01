import { useState } from 'react';
import { Plus, Search, Mail, Phone, FolderOpen, Pencil, Trash2, Eye, UserCircle } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { useProjects } from '../hooks/useProjects';
import { employeesApi, GetEmployeeViewModel, CreateEmployeeViewModel, UpdateEmployeeViewModel } from '../api';
import { Spinner } from '../components/ui/Spinner';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { EmployeeForm } from '../components/employees/EmployeeForm';
import { useToast } from '../components/ui/Toast';

export function EmployeesPage() {
  const { employees, loading, error, refetch } = useEmployees();
  const { projects } = useProjects();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<GetEmployeeViewModel | null>(null);
  const [viewEmployee, setViewEmployee] = useState<GetEmployeeViewModel | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<GetEmployeeViewModel | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filtered = employees.filter(emp => {
    const full = [emp.lastName, emp.firstName, emp.patronymic].filter(Boolean).join(' ').toLowerCase();
    const q = search.toLowerCase();
    return full.includes(q) || (emp.email ?? '').toLowerCase().includes(q) || (emp.phoneNumber ?? '').includes(q);
  });

  const handleCreate = async (data: CreateEmployeeViewModel | UpdateEmployeeViewModel) => {
    await employeesApi.create(data as CreateEmployeeViewModel);
    showToast('Сотрудник добавлен');
    setCreateOpen(false);
    refetch();
  };

  const handleEdit = async (data: CreateEmployeeViewModel | UpdateEmployeeViewModel) => {
    if (!editEmployee) return;
    await employeesApi.update(editEmployee.id, data as UpdateEmployeeViewModel);
    showToast('Данные сотрудника обновлены');
    setEditEmployee(null);
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteEmployee) return;
    try {
      setDeleteLoading(true);
      await employeesApi.delete(deleteEmployee.id);
      showToast('Сотрудник удалён');
      setDeleteEmployee(null);
      refetch();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Ошибка удаления', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getInitials = (emp: GetEmployeeViewModel) =>
    [(emp.firstName ?? '')[0], (emp.lastName ?? '')[0]].filter(Boolean).join('').toUpperCase() || '?';

  const getFullName = (emp: GetEmployeeViewModel) =>
    [emp.lastName, emp.firstName, emp.patronymic].filter(Boolean).join(' ') || 'Без имени';

  const avatarColors = [
    'bg-indigo-500', 'bg-violet-500', 'bg-pink-500', 'bg-blue-500',
    'bg-emerald-500', 'bg-orange-500', 'bg-teal-500', 'bg-rose-500',
  ];
  const getAvatarColor = (id: number) => avatarColors[id % avatarColors.length];

  if (loading) return <Spinner />;
  if (error) return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center space-y-3">
        <p className="text-red-500 font-medium">{error}</p>
        <button onClick={refetch} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition">Повторить</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Сотрудники</h1>
          <p className="text-sm text-gray-500 mt-1">{employees.length} сотрудник{employees.length === 1 ? '' : employees.length < 5 ? 'а' : 'ов'}</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition shadow-sm"
        >
          <Plus size={16} />
          Добавить сотрудника
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по ФИО, email или телефону..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
      </div>

      {/* Employees Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <UserCircle size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">Сотрудники не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(emp => (
            <div key={emp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full ${getAvatarColor(emp.id)} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {getInitials(emp)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{getFullName(emp)}</p>
                  <p className="text-xs text-gray-400">ID: {emp.id}</p>
                </div>
              </div>

              {/* Contacts */}
              <div className="space-y-1.5">
                {emp.email && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Mail size={12} className="shrink-0 text-indigo-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                )}
                {emp.phoneNumber && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone size={12} className="shrink-0 text-indigo-400" />
                    <span>{emp.phoneNumber}</span>
                  </div>
                )}
              </div>

              {/* Projects */}
              <div className="flex items-center gap-2">
                <FolderOpen size={12} className="text-gray-400 shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {!emp.projects?.length
                    ? <span className="text-xs text-gray-400">Нет проектов</span>
                    : emp.projects.map(p => (
                        <Badge key={p.id} variant="indigo">{p.title}</Badge>
                      ))
                  }
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-2 border-t border-gray-50">
                <button
                  onClick={() => setViewEmployee(emp)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <Eye size={13} /> Подробнее
                </button>
                <button
                  onClick={() => setEditEmployee(emp)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteEmployee(emp)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Новый сотрудник" size="md">
        <EmployeeForm mode="create" projects={projects} onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editEmployee} onClose={() => setEditEmployee(null)} title="Редактировать сотрудника" size="md">
        {editEmployee && (
          <EmployeeForm mode="edit" initialData={editEmployee} projects={projects} onSubmit={handleEdit} onCancel={() => setEditEmployee(null)} />
        )}
      </Modal>

      {/* View Modal */}
      <Modal open={!!viewEmployee} onClose={() => setViewEmployee(null)} title={getFullName(viewEmployee!)} size="md">
        {viewEmployee && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl ${getAvatarColor(viewEmployee.id)} flex items-center justify-center text-white text-xl font-bold`}>
                {getInitials(viewEmployee)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{getFullName(viewEmployee)}</p>
                <p className="text-sm text-gray-400">ID: {viewEmployee.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {viewEmployee.email && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail size={16} className="text-indigo-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm text-gray-800">{viewEmployee.email}</p>
                  </div>
                </div>
              )}
              {viewEmployee.phoneNumber && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone size={16} className="text-indigo-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Телефон</p>
                    <p className="text-sm text-gray-800">{viewEmployee.phoneNumber}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Проекты ({viewEmployee.projects?.length ?? 0})</p>
              {!viewEmployee.projects?.length
                ? <p className="text-sm text-gray-400">Не участвует в проектах</p>
                : (
                  <div className="flex flex-wrap gap-2">
                    {viewEmployee.projects.map(p => (
                      <Badge key={p.id} variant="indigo">{p.title}</Badge>
                    ))}
                  </div>
                )
              }
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteEmployee} onClose={() => setDeleteEmployee(null)} title="Удалить сотрудника?" size="sm">
        {deleteEmployee && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Вы уверены, что хотите удалить сотрудника <strong>{getFullName(deleteEmployee)}</strong>? Это действие необратимо.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-medium rounded-lg transition"
              >
                {deleteLoading ? 'Удаление...' : 'Удалить'}
              </button>
              <button onClick={() => setDeleteEmployee(null)} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition">
                Отмена
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
