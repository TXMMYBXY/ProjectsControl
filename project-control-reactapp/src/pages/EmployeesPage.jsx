import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Search, Mail, Phone, FolderOpen, Pencil, Trash2, UserCircle } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees.js';
import { useProjects } from '../hooks/useProjects.js';
import { employeesApi } from '../api/index.js';
import { Spinner } from '../components/ui/Spinner.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { EmployeeForm } from '../components/employees/EmployeeForm.jsx';
import { useToast } from '../components/ui/Toast.jsx';
export function EmployeesPage() {
  const { employees, loading, error, refetch } = useEmployees();
  const { projects } = useProjects();
  const { showToast } = useToast();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  // Открываем конкретного сотрудника из location.state (с дашборда)
  useEffect(() => {
    if (!location.state?.openEmployeeId || employees.length === 0) return;
    const found = employees.find(e => e.id === location.state.openEmployeeId);
    if (found) setEditEmployee(found);
    window.history.replaceState({}, '');
  }, [location.state, employees]);
  const filtered = employees.filter(emp => {
    const full = [emp.lastName, emp.firstName, emp.patronymic].filter(Boolean).join(' ').toLowerCase();
    const q = search.toLowerCase();
    return full.includes(q) || (emp.email ?? '').toLowerCase().includes(q) || (emp.phoneNumber ?? '').includes(q);
  });
  const handleCreate = async (data) => {
    await employeesApi.create(data);
    showToast('Сотрудник добавлен');
    setCreateOpen(false);
    refetch();
  };
  const handleEditDone = async () => {
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
    } catch (e) {
      showToast(e?.message ?? 'Ошибка удаления', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };
  const getInitials = (emp) =>
    [(emp.firstName ?? '')[0], (emp.lastName ?? '')[0]].filter(Boolean).join('').toUpperCase() || '?';
  const getFullName = (emp) =>
    [emp.lastName, emp.firstName, emp.patronymic].filter(Boolean).join(' ') || 'Без имени';
  const avatarColors = [
    'bg-indigo-500', 'bg-violet-500', 'bg-pink-500', 'bg-blue-500',
    'bg-emerald-500', 'bg-orange-500', 'bg-teal-500', 'bg-rose-500',
  ];
  const getAvatarColor = (id) => avatarColors[id % avatarColors.length];
  if (loading) return <Spinner />;
  if (error) return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center space-y-3">
        <p className="text-red-500 font-medium">{error}</p>
        <button onClick={refetch} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition">
          Повторить
        </button>
      </div>
    </div>
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Сотрудники</h1>
          <p className="text-sm text-gray-500 mt-1">
            {employees.length} сотрудник{employees.length === 1 ? '' : employees.length < 5 ? 'а' : 'ов'}
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition shadow-sm"
        >
          <Plus size={16} />
          Добавить сотрудника
        </button>
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по ФИО, email или телефону..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <UserCircle size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">Сотрудники не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(emp => (
            <div key={emp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
              {/* Шапка */}
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full ${getAvatarColor(emp.id)} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {getInitials(emp)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 text-sm truncate">{getFullName(emp)}</p>
                  {emp.email && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Mail size={10} className="text-indigo-400 shrink-0" />
                      <span className="text-xs text-gray-400 truncate">{emp.email}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Телефон */}
              {emp.phoneNumber && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={12} className="shrink-0 text-indigo-400" />
                  <span>{emp.phoneNumber}</span>
                </div>
              )}
              {/* Проекты */}
              <div className="flex items-start gap-2">
                <FolderOpen size={12} className="text-gray-400 shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {!emp.projects?.length
                    ? <span className="text-xs text-gray-400">Нет проектов</span>
                    : emp.projects.map(p => (
                      <Badge key={p.id} variant="indigo">{p.title}</Badge>
                    ))
                  }
                </div>
              </div>
              {/* Кнопки */}
              <div className="flex gap-2 mt-auto pt-2 border-t border-gray-50 justify-end">
                <button
                  onClick={() => setEditEmployee(emp)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <Pencil size={13} /> Редактировать
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
      {/* Создание */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Новый сотрудник" size="md">
        <EmployeeForm mode="create" projects={projects} onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>
      {/* Редактирование */}
      <Modal open={!!editEmployee} onClose={() => setEditEmployee(null)} title="Редактировать сотрудника" size="md">
        {editEmployee && (
          <EmployeeForm
            mode="edit"
            initialData={editEmployee}
            projects={projects}
            onSubmit={handleEditDone}
            onCancel={() => setEditEmployee(null)}
          />
        )}
      </Modal>
      {/* Удаление */}
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
              <button
                onClick={() => setDeleteEmployee(null)}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}