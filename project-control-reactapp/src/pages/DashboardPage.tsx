import { useProjects } from '../hooks/useProjects';
import { useEmployees } from '../hooks/useEmployees';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { FolderKanban, Users, Star, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
}

function priorityVariant(p: number): 'green' | 'yellow' | 'red' {
  if (p <= 3) return 'green';
  if (p <= 6) return 'yellow';
  return 'red';
}

function priorityLabel(p: number): string {
  if (p <= 3) return 'Низкий';
  if (p <= 6) return 'Средний';
  return 'Высокий';
}

export function DashboardPage() {
  const { projects, loading: pLoading } = useProjects();
  const { employees, loading: eLoading } = useEmployees();
  const navigate = useNavigate();

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
    { label: 'Всего проектов', value: totalProjects, icon: FolderKanban, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Сотрудников', value: totalEmployees, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Активных проектов', value: activeProjects, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Высокий приоритет', value: highPriority, icon: Star, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
        <p className="text-sm text-gray-500 mt-1">Общая сводка по системе</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Priority Projects */}
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
          <div className="space-y-3">
            {topProjects.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Нет проектов</p>
            ) : (
              topProjects.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer" onClick={() => navigate('/projects')}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400 truncate">{p.customerCompany}</p>
                  </div>
                  <Badge variant={priorityVariant(p.priority)}>{priorityLabel(p.priority)}</Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Employees */}
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
          <div className="space-y-3">
            {employees.slice(0, 5).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Нет сотрудников</p>
            ) : (
              employees.slice(0, 5).map(emp => {
                const colors = ['bg-indigo-500','bg-violet-500','bg-pink-500','bg-blue-500','bg-emerald-500'];
                const color = colors[emp.id % colors.length];
                const name = [emp.lastName, emp.firstName, emp.patronymic].filter(Boolean).join(' ') || 'Без имени';
                const initials = [(emp.firstName ?? '')[0], (emp.lastName ?? '')[0]].filter(Boolean).join('').toUpperCase() || '?';
                return (
                  <div key={emp.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer" onClick={() => navigate('/employees')}>
                    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
                      <p className="text-xs text-gray-400">{emp.projects?.length ?? 0} проект{(emp.projects?.length ?? 0) === 1 ? '' : 'ов'}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Upcoming deadlines */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-indigo-500" />
          <h2 className="font-semibold text-gray-800">Ближайшие дедлайны</h2>
        </div>
        {projects.filter(p => p.endDate).sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime()).slice(0, 4).length === 0
          ? <p className="text-sm text-gray-400">Нет проектов с установленными сроками</p>
          : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.filter(p => p.endDate).sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime()).slice(0, 4).map(p => {
                const daysLeft = Math.ceil((new Date(p.endDate!).getTime() - Date.now()) / 86400000);
                const urgent = daysLeft < 7;
                return (
                  <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border ${urgent ? 'border-red-100 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${urgent ? 'bg-red-500' : 'bg-green-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                      <p className="text-xs text-gray-400">{formatDate(p.endDate)}</p>
                    </div>
                    <span className={`text-xs font-medium ${urgent ? 'text-red-600' : 'text-gray-500'}`}>
                      {daysLeft < 0 ? 'Просрочен' : daysLeft === 0 ? 'Сегодня' : `${daysLeft} дн.`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
}
