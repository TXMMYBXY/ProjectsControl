import { useState } from 'react';
import { useProjects } from '../hooks/useProjects.js';
import { useEmployees } from '../hooks/useEmployees.js';
import { Spinner } from '../components/ui/Spinner.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import {
  FolderKanban, Users, Star, TrendingUp, Calendar, ArrowRight,
  Building2, Mail, Phone, FolderOpen, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatDateShort(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

function getFullName(emp) {
  if (!emp) return '—';
  return [emp.lastName, emp.firstName, emp.patronymic].filter(Boolean).join(' ') || '—';
}

const avatarColors = [
  'bg-indigo-500', 'bg-violet-500', 'bg-pink-500', 'bg-blue-500',
  'bg-emerald-500', 'bg-orange-500', 'bg-teal-500', 'bg-rose-500',
];
const getAvatarColor = (id) => avatarColors[id % avatarColors.length];
const getInitials = (emp) =>
  [(emp.firstName ?? '')[0], (emp.lastName ?? '')[0]].filter(Boolean).join('').toUpperCase() || '?';

// Модал просмотра проекта
function ProjectDetailModal({ project, open, onClose, onGoToProjects }) {
  if (!project) return null;
  return (
    <Modal open={open} onClose={onClose} title={project.title ?? 'Проект'} size="lg">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Badge variant={priorityVariant(project.priority)}>
            <Star size={10} className="mr-1" />
            {priorityLabel(project.priority)} ({project.priority})
          </Badge>
          <button
            onClick={onGoToProjects}
            className="ml-auto flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 transition"
          >
            <ExternalLink size={12} /> Открыть в разделе
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Компания-заказчик</p>
            <p className="text-sm font-medium text-gray-800">{project.customerCompany}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Компания-исполнитель</p>
            <p className="text-sm font-medium text-gray-800">{project.performingCompany}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Дата начала</p>
            <p className="text-sm font-medium text-gray-800">{formatDate(project.startDate)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Дата окончания</p>
            <p className="text-sm font-medium text-gray-800">{formatDate(project.endDate)}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Руководитель проекта</p>
          {project.projectManager ? (
            <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
              <div className={`w-9 h-9 rounded-full ${getAvatarColor(project.projectManager.id)} flex items-center justify-center text-white text-sm font-bold`}>
                {(project.projectManager.firstName ?? '?')[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{getFullName(project.projectManager)}</p>
                {project.projectManager.email && <p className="text-xs text-gray-500">{project.projectManager.email}</p>}
              </div>
            </div>
          ) : <p className="text-sm text-gray-400">Не назначен</p>}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Команда ({project.employees?.length ?? 0})</p>
          {!project.employees?.length ? (
            <p className="text-sm text-gray-400">Нет сотрудников</p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {project.employees.map(emp => (
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
    </Modal>
  );
}

// Модал просмотра сотрудника
function EmployeeDetailModal({ employee, open, onClose, onGoToEmployees }) {
  if (!employee) return null;
  return (
    <Modal open={open} onClose={onClose} title={getFullName(employee)} size="md">
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl ${getAvatarColor(employee.id)} flex items-center justify-center text-white text-xl font-bold`}>
            {getInitials(employee)}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{getFullName(employee)}</p>
            <p className="text-sm text-gray-400">ID: {employee.id}</p>
          </div>
          <button
            onClick={onGoToEmployees}
            className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 transition"
          >
            <ExternalLink size={12} /> Открыть в разделе
          </button>
        </div>

        <div className="space-y-2">
          {employee.email && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Mail size={16} className="text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm text-gray-800">{employee.email}</p>
              </div>
            </div>
          )}
          {employee.phoneNumber && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Phone size={16} className="text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Телефон</p>
                <p className="text-sm text-gray-800">{employee.phoneNumber}</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">
            Проекты ({employee.projects?.length ?? 0})
          </p>
          {!employee.projects?.length ? (
            <p className="text-sm text-gray-400">Не участвует в проектах</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {employee.projects.map(p => (
                <Badge key={p.id} variant="indigo">{p.title}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export function DashboardPage() {
  const { projects, loading: pLoading } = useProjects();
  const { employees, loading: eLoading } = useEmployees();
  const navigate = useNavigate();

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  if (pLoading || eLoading) return <Spinner />;

  const totalProjects = projects.length;
  const totalEmployees = employees.length;
  const highPriority = projects.filter(p => p.priority > 6).length;
  const activeProjects = projects.filter(p => {
    const now = Date.now();
    const end = p.endDate ? new Date(p.endDate).getTime() : Infinity;
    return end >= now;
  }).length;

  const topProjects = [...projects].sort((a, b) => b.priority - a.priority).slice(0, 5);

  const stats = [
    { label: 'Всего проектов', value: totalProjects, icon: FolderKanban, color: 'text-indigo-600', bg: 'bg-indigo-50', onClick: () => navigate('/projects') },
    { label: 'Сотрудников', value: totalEmployees, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50', onClick: () => navigate('/employees') },
    { label: 'Активных проектов', value: activeProjects, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', onClick: () => navigate('/projects') },
    { label: 'Высокий приоритет', value: highPriority, icon: Star, color: 'text-orange-600', bg: 'bg-orange-50', onClick: () => navigate('/projects') },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
        <p className="text-sm text-gray-500 mt-1">Общая сводка по системе</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left hover:shadow-md hover:border-indigo-100 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Топ проектов */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Проекты по приоритету</h2>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
            >
              Все <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {topProjects.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Нет проектов</p>
            ) : (
              topProjects.map(p => (
                <button
                  key={p.id}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 transition cursor-pointer text-left group"
                  onClick={() => setSelectedProject(p)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-indigo-700">{p.title}</p>
                    <p className="text-xs text-gray-400 truncate">{p.customerCompany}</p>
                  </div>
                  <Badge variant={priorityVariant(p.priority)}>{priorityLabel(p.priority)}</Badge>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Сотрудники */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Сотрудники</h2>
            <button
              onClick={() => navigate('/employees')}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
            >
              Все <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {employees.slice(0, 5).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Нет сотрудников</p>
            ) : (
              employees.slice(0, 5).map(emp => {
                const name = getFullName(emp);
                const initials = getInitials(emp);
                const color = getAvatarColor(emp.id);
                return (
                  <button
                    key={emp.id}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 transition cursor-pointer text-left group"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate group-hover:text-indigo-700">{name}</p>
                      <p className="text-xs text-gray-400">
                        {emp.projects?.length ?? 0} проект{(emp.projects?.length ?? 0) === 1 ? '' : 'ов'}
                        {emp.email && <span className="ml-2">· {emp.email}</span>}
                      </p>
                    </div>
                    <FolderOpen size={14} className="text-gray-300 group-hover:text-indigo-400 shrink-0 transition" />
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Дедлайны */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-indigo-500" />
          <h2 className="font-semibold text-gray-800">Ближайшие дедлайны</h2>
        </div>
        {projects.filter(p => p.endDate).length === 0
          ? <p className="text-sm text-gray-400">Нет проектов с установленными сроками</p>
          : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects
                .filter(p => p.endDate)
                .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
                .slice(0, 4)
                .map(p => {
                  const daysLeft = Math.ceil((new Date(p.endDate).getTime() - Date.now()) / 86400000);
                  const urgent = daysLeft < 7;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProject(p)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left w-full transition hover:shadow-sm
                        ${urgent ? 'border-red-100 bg-red-50 hover:bg-red-100' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'}`}
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 ${urgent ? 'bg-red-500' : 'bg-green-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                        <p className="text-xs text-gray-400">{formatDateShort(p.endDate)}</p>
                      </div>
                      <span className={`text-xs font-medium shrink-0 ${urgent ? 'text-red-600' : 'text-gray-500'}`}>
                        {daysLeft < 0 ? 'Просрочен' : daysLeft === 0 ? 'Сегодня' : `${daysLeft} дн.`}
                      </span>
                    </button>
                  );
                })}
            </div>
          )}
      </div>

      {/* Модалы */}
      <ProjectDetailModal
        project={selectedProject}
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onGoToProjects={() => { setSelectedProject(null); navigate('/projects'); }}
      />
      <EmployeeDetailModal
        employee={selectedEmployee}
        open={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onGoToEmployees={() => { setSelectedEmployee(null); navigate('/employees'); }}
      />
    </div>
  );
}
