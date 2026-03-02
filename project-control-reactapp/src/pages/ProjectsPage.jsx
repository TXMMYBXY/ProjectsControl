import { useState } from 'react';
import { Plus, Search, Calendar, Building2, Users, Star, Pencil, Trash2, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { useProjects } from '../hooks/useProjects.js';
import { useEmployees } from '../hooks/useEmployees.js';
import { projectsApi } from '../api/index.js';
import { Spinner } from '../components/ui/Spinner.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { ProjectForm } from '../components/projects/ProjectForm.jsx';
import { DocumentsPanel } from '../components/documents/DocumentsPanel.jsx';
import { useToast } from '../components/ui/Toast.jsx';

function priorityVariant(p) {
  if (p <= 3) return 'green';
  if (p <= 6) return 'yellow';
  return 'red';
}

function priorityLabel(p) {
  if (p <= 3) return 'Низкий';
  if (p <= 6) return 'Средний';
  return 'Высокий';
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getFullName(emp) {
  if (!emp) return '—';
  return [emp.lastName, emp.firstName, emp.patronymic].filter(Boolean).join(' ') || '—';
}

const avatarColors = ['bg-indigo-500', 'bg-violet-500', 'bg-pink-500', 'bg-blue-500', 'bg-emerald-500'];
const getAvatarColor = (id) => avatarColors[id % avatarColors.length];

export function ProjectsPage() {
  const { projects, loading, error, refetch } = useProjects();
  const { employees } = useEmployees();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('priority');
  const [sortDir, setSortDir] = useState('desc');

  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [viewProject, setViewProject] = useState(null);
  const [docsProject, setDocsProject] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const filtered = projects
    .filter(p =>
      (p.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (p.customerCompany ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (p.performingCompany ?? '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === 'title') cmp = (a.title ?? '').localeCompare(b.title ?? '');
      if (sortField === 'priority') cmp = a.priority - b.priority;
      if (sortField === 'startDate') cmp = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const handleCreate = async (data) => {
    await projectsApi.create(data);
    showToast('Проект успешно создан');
    setCreateOpen(false);
    refetch();
  };

  // При редактировании форма сама вызвала API (update + changeEmployees)
  // onSubmit вызывается с null — просто закрываем и рефетчим
  const handleEditDone = async (data) => {
    if (data !== null) {
      // Fallback если форма передала данные (не ожидается в edit mode)
      await projectsApi.update(editProject.id, data);
    }
    showToast('Проект обновлён');
    setEditProject(null);
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteProject) return;
    try {
      setDeleteLoading(true);
      await projectsApi.delete(deleteProject.id);
      showToast('Проект удалён');
      setDeleteProject(null);
      refetch();
    } catch (e) {
      showToast(e?.message ?? 'Ошибка удаления', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={12} className="text-gray-300" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-indigo-500" /> : <ChevronDown size={12} className="text-indigo-500" />;
  };

  if (loading) return <Spinner />;
  if (error) return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center space-y-3">
        <p className="text-red-500 font-medium">{error}</p>
        <button onClick={refetch} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition">Повторить</button>
      </div>
    </div>
  );

  const sortLabels = { title: 'Название', priority: 'Приоритет', startDate: 'Дата' };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Проекты</h1>
          <p className="text-sm text-gray-500 mt-1">
            {projects.length} проект{projects.length === 1 ? '' : projects.length < 5 ? 'а' : 'ов'}
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition shadow-sm"
        >
          <Plus size={16} />
          Новый проект
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по названию, заказчику или исполнителю..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {['title', 'priority', 'startDate'].map(f => (
            <button
              key={f}
              onClick={() => toggleSort(f)}
              className={`flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border transition
                ${sortField === f ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {sortLabels[f]}
              <SortIcon field={f} />
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Building2 size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">Проекты не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(project => (
            <div key={project.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{project.title}</h3>
                <Badge variant={priorityVariant(project.priority)}>
                  <Star size={10} className="mr-1" />
                  {priorityLabel(project.priority)} ({project.priority})
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Building2 size={12} className="shrink-0" />
                  <span className="truncate"><span className="text-gray-400">Заказчик:</span> {project.customerCompany}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Building2 size={12} className="shrink-0 text-indigo-400" />
                  <span className="truncate"><span className="text-gray-400">Исполнитель:</span> {project.performingCompany}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={12} />
                {formatDate(project.startDate)} — {formatDate(project.endDate)}
              </div>

              <div className="flex items-center gap-1 flex-wrap">
                {project.projectManager && (
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700`}>
                    <div className={`w-4 h-4 rounded-full ${getAvatarColor(project.projectManager.id)} flex items-center justify-center text-white text-[9px] font-bold`}>
                      {(project.projectManager.firstName ?? '?')[0]}
                    </div>
                    РП: {getFullName(project.projectManager)}
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users size={11} />
                  {project.employees?.length ?? 0} сотр.
                </div>
              </div>

              <div className="flex gap-2 mt-auto pt-2 border-t border-gray-50">
                <button
                  onClick={() => setViewProject(project)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <Eye size={13} /> Подробнее
                </button>
                <button
                  onClick={() => setDocsProject(project)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition"
                >
                  📎 Документы
                </button>
                <button
                  onClick={() => setEditProject(project)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteProject(project)}
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
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Новый проект" size="lg">
        <ProjectForm mode="create" employees={employees} onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      {/* Редактирование */}
      <Modal open={!!editProject} onClose={() => setEditProject(null)} title="Редактировать проект" size="lg">
        {editProject && (
          <ProjectForm
            mode="edit"
            initialData={editProject}
            employees={employees}
            onSubmit={handleEditDone}
            onCancel={() => setEditProject(null)}
          />
        )}
      </Modal>

      {/* Просмотр */}
      <Modal open={!!viewProject} onClose={() => setViewProject(null)} title={viewProject?.title ?? 'Проект'} size="lg">
        {viewProject && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant={priorityVariant(viewProject.priority)}>
                <Star size={10} className="mr-1" />
                {priorityLabel(viewProject.priority)} ({viewProject.priority})
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Компания-заказчик</p>
                <p className="text-sm font-medium text-gray-800">{viewProject.customerCompany}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Компания-исполнитель</p>
                <p className="text-sm font-medium text-gray-800">{viewProject.performingCompany}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Дата начала</p>
                <p className="text-sm font-medium text-gray-800">{formatDate(viewProject.startDate)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Дата окончания</p>
                <p className="text-sm font-medium text-gray-800">{formatDate(viewProject.endDate)}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Руководитель проекта</p>
              {viewProject.projectManager ? (
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
                  <div className={`w-9 h-9 rounded-full ${getAvatarColor(viewProject.projectManager.id)} flex items-center justify-center text-white text-sm font-bold`}>
                    {(viewProject.projectManager.firstName ?? '?')[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{getFullName(viewProject.projectManager)}</p>
                    {viewProject.projectManager.email && <p className="text-xs text-gray-500">{viewProject.projectManager.email}</p>}
                  </div>
                </div>
              ) : <p className="text-sm text-gray-400">Не назначен</p>}
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Команда ({viewProject.employees?.length ?? 0})</p>
              {!viewProject.employees?.length ? (
                <p className="text-sm text-gray-400">Нет сотрудников</p>
              ) : (
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {viewProject.employees.map(emp => (
                    <div key={emp.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                      <div className={`w-7 h-7 rounded-full ${getAvatarColor(emp.id)} flex items-center justify-center text-white text-xs font-bold`}>
                        {(emp.firstName ?? '?')[0]}
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">{getFullName(emp)}</p>
                        {emp.email && <p className="text-xs text-gray-400">{emp.email}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Документы */}
      <Modal open={!!docsProject} onClose={() => setDocsProject(null)} title={`Документы: ${docsProject?.title ?? ''}`} size="xl">
        {docsProject && (
          <DocumentsPanel projectId={docsProject.id} projectTitle={docsProject.title ?? ''} />
        )}
      </Modal>

      {/* Удаление */}
      <Modal open={!!deleteProject} onClose={() => setDeleteProject(null)} title="Удалить проект?" size="sm">
        {deleteProject && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Вы уверены, что хотите удалить проект <strong>«{deleteProject.title}»</strong>? Это действие необратимо.
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
                onClick={() => setDeleteProject(null)}
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
