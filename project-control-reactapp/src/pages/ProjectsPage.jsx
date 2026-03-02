import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Plus, Search, Calendar, Building2, Users, Star,
  Pencil, Trash2, Eye, ChevronUp, ChevronDown, FileText, Download, Filter, X
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects.js';
import { useEmployees } from '../hooks/useEmployees.js';
import { projectsApi } from '../api/index.js';
import { documentsApi } from '../api/index.js';
import { Spinner } from '../components/ui/Spinner.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { StatusBadge } from '../components/ui/StatusBadge.jsx';
import { ProjectForm } from '../components/projects/ProjectForm.jsx';
import { DocumentsPanel } from '../components/documents/DocumentsPanel.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import {
  ALL_STATUSES,
  PROJECT_STATUS,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
} from '../utils/projectStatus.js';
function resolveStatus(status) {
  if (status === null || status === undefined) return 0;
  if (typeof status === 'number') return status;
  const asNum = Number(status);
  if (!isNaN(asNum) && String(asNum) === String(status).trim()) return asNum;
  if (PROJECT_STATUS[status] !== undefined) return PROJECT_STATUS[status];
  return 0;
}
function getFileIcon(name, size = 15) {
  const ext = (name ?? '').split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext))
    return <FileText size={size} className="text-purple-500" />;
  if (['xls', 'xlsx', 'csv'].includes(ext))
    return <FileText size={size} className="text-green-600" />;
  if (['zip', 'rar', '7z'].includes(ext))
    return <FileText size={size} className="text-amber-500" />;
  return <FileText size={size} className="text-gray-400" />;
}
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
function isValidDate(iso) {
  if (!iso) return false;
  const year = parseInt(iso.slice(0, 4), 10);
  if (year <= 1) return false;
  return true;
}
function formatDate(iso) {
  if (!isValidDate(iso)) return null;
  const [year, month, day] = iso.slice(0, 10).split('-');
  return `${day}.${month}.${year}`;
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
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('priority');
  const [sortDir, setSortDir] = useState('desc');
  const [statusFilter, setStatusFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null); // 'high' | null
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [viewProject, setViewProject] = useState(null);
  const [docsProject, setDocsProject] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  // Применяем фильтры и открываем проект из location.state (с дашборда)
  useEffect(() => {
    if (!location.state) return;
    const state = location.state;
    if (state.statusFilter !== undefined) {
      setStatusFilter(state.statusFilter);
    }
    if (state.priorityFilter === 'high') {
      setPriorityFilter('high');
    }
    if (state.openProjectId && projects.length > 0) {
      const found = projects.find(p => p.id === state.openProjectId);
      if (found) setViewProject(found);
    }
    // Очищаем state чтобы при повторном заходе не срабатывало
    window.history.replaceState({}, '');
  }, [location.state, projects]);
  const handleDocUploaded = async () => {
    await refetch();
  };
  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };
  const filtered = projects
    .filter(p => {
      const matchSearch =
        (p.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (p.customerCompany ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (p.performingCompany ?? '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === null || resolveStatus(p.status) === statusFilter;
      const matchPriority = priorityFilter !== 'high' || p.priority > 6;
      return matchSearch && matchStatus && matchPriority;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === 'title') cmp = (a.title ?? '').localeCompare(b.title ?? '');
      if (sortField === 'priority') cmp = a.priority - b.priority;
      if (sortField === 'startDate') {
        const aTime = isValidDate(a.startDate) ? new Date(a.startDate).getTime() : 0;
        const bTime = isValidDate(b.startDate) ? new Date(b.startDate).getTime() : 0;
        cmp = aTime - bTime;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  const statusCounts = ALL_STATUSES.map(s => ({
    ...s,
    count: projects.filter(p => resolveStatus(p.status) === s.value).length,
  }));
  const hasActiveFilter = statusFilter !== null || priorityFilter !== null || search;
  const resetFilters = () => {
    setSearch('');
    setStatusFilter(null);
    setPriorityFilter(null);
  };
  const handleCreate = async (data) => {
    await projectsApi.create(data);
    showToast('Проект успешно создан');
    setCreateOpen(false);
    refetch();
  };
  const handleEditDone = async () => {
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
    <div className="space-y-5">
      {/* Заголовок */}
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
      {/* Фильтры */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-gray-400 mr-1">
          <Filter size={12} /> Статус:
        </div>
        <button
          onClick={() => setStatusFilter(null)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition
            ${statusFilter === null && priorityFilter === null
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
        >
          Все
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold
            ${statusFilter === null && priorityFilter === null ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
            {projects.length}
          </span>
        </button>
        {statusCounts.filter(s => s.count > 0).map(({ value, label, count }) => {
          const colors = PROJECT_STATUS_COLORS[value];
          const active = statusFilter === value && priorityFilter === null;
          return (
            <button
              key={value}
              onClick={() => { setStatusFilter(active ? null : value); setPriorityFilter(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition
                ${active
                  ? `${colors.bg} ${colors.text} ${colors.border} ring-2 ring-offset-1 ring-current`
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${active ? colors.dot : 'bg-gray-300'}`} />
              {label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold
                ${active ? `${colors.bg} ${colors.text}` : 'bg-gray-100 text-gray-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
        {/* Фильтр высокого приоритета */}
        <button
          onClick={() => { setPriorityFilter(priorityFilter === 'high' ? null : 'high'); setStatusFilter(null); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition
            ${priorityFilter === 'high'
              ? 'bg-orange-50 text-orange-700 border-orange-300 ring-2 ring-offset-1 ring-orange-300'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
        >
          <Star size={10} className={priorityFilter === 'high' ? 'text-orange-500' : 'text-gray-400'} />
          Высокий приоритет
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold
            ${priorityFilter === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
            {projects.filter(p => p.priority > 6).length}
          </span>
        </button>
        {hasActiveFilter && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-400 hover:text-gray-600 transition"
          >
            <X size={12} /> Сбросить
          </button>
        )}
      </div>
      {/* Поиск и сортировка */}
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
      {/* Список проектов */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Building2 size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">Проекты не найдены</p>
          {hasActiveFilter && (
            <button
              onClick={resetFilters}
              className="mt-3 text-sm text-indigo-500 hover:text-indigo-700 transition"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(project => (
            <div key={project.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
              {/* Шапка: название + приоритет */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{project.title}</h3>
                <Badge variant={priorityVariant(project.priority)}>
                  <Star size={10} className="mr-1" />
                  {project.priority}
                </Badge>
              </div>
              {/* Статус */}
              <div>
                <StatusBadge status={project.status} size="sm" />
              </div>
              {/* Компании */}
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
              {/* Даты */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={12} />
                {formatDate(project.startDate) ?? '—'}
                <span className="text-gray-300">→</span>
                {isValidDate(project.endDate)
                  ? <span className="text-gray-500">{formatDate(project.endDate)}</span>
                  : <span className="italic text-gray-300">Бессрочно</span>
                }
              </div>
              {/* Команда */}
              <div className="flex items-center gap-1 flex-wrap">
                {project.projectManager && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700">
                    <div className={`w-4 h-4 rounded-full ${getAvatarColor(project.projectManager.id)} flex items-center justify-center text-white text-[9px] font-bold`}>
                      {(project.projectManager.firstName ?? '?')[0]}
                    </div>
                    РП: {getFullName(project.projectManager)}
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Users size={11} />
                  {project.employees?.length ?? 0} сотр.
                </div>
              </div>
              {/* Кнопки действий */}
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
                  <FileText size={13} />
                  Документы
                  {(project.documents?.length ?? 0) > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-full leading-none">
                      {project.documents.length}
                    </span>
                  )}
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
      {/* === МОДАЛЫ === */}
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
              <StatusBadge status={viewProject.status} />
              <Badge variant={priorityVariant(viewProject.priority)}>
                <Star size={10} className="mr-1" />
                {priorityLabel(viewProject.priority)} ({viewProject.priority})
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
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
                <p className="text-sm font-medium text-gray-800">{formatDate(viewProject.startDate) ?? '—'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Дата окончания</p>
                {isValidDate(viewProject.endDate)
                  ? <p className="text-sm font-medium text-gray-800">{formatDate(viewProject.endDate)}</p>
                  : <p className="text-sm italic text-gray-400">Не установлена</p>
                }
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
              ) : <p className="text-sm text-gray-400 italic">Не назначен</p>}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Команда ({viewProject.employees?.length ?? 0})</p>
              {!viewProject.employees?.length ? (
                <p className="text-sm text-gray-400 italic">Нет сотрудников</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
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
            {(viewProject.documents?.length ?? 0) > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                  <FileText size={12} /> Документы ({viewProject.documents.length})
                </p>
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 max-h-40 overflow-y-auto">
                  {viewProject.documents.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition">
                      <div className="shrink-0">{getFileIcon(doc.fileName, 15)}</div>
                      <span className="flex-1 text-sm text-gray-700 truncate">{doc.fileName ?? `Документ #${doc.id}`}</span>
                      <button
                        onClick={() => documentsApi.download(doc.id, doc.fileName)}
                        className="shrink-0 p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
                        title="Скачать"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
      {/* Документы */}
      <Modal open={!!docsProject} onClose={() => setDocsProject(null)} title={`Документы: ${docsProject?.title ?? ''}`} size="xl">
        {docsProject && (
          <DocumentsPanel
            projectId={docsProject.id}
            projectTitle={docsProject.title ?? ''}
            initialDocuments={
              projects.find(p => p.id === docsProject.id)?.documents ?? docsProject.documents ?? []
            }
            onUploaded={handleDocUploaded}
          />
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