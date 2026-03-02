// ProjectStatus enum (соответствует C# enum на бэкенде)
// 0 = Backlog, 1 = Planning, 2 = Active, 3 = Stoped, 4 = Completed, 5 = Archived

export const PROJECT_STATUS = {
  Backlog: 0,
  Planning: 1,
  Active: 2,
  Stoped: 3,
  Completed: 4,
  Archived: 5,
};

export const PROJECT_STATUS_LABELS = {
  0: 'Backlog',
  1: 'Планирование',
  2: 'Активный',
  3: 'Приостановлен',
  4: 'Завершён',
  5: 'Архив',
};

export const PROJECT_STATUS_COLORS = {
  0: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' },
  1: { bg: 'bg-blue-50',  text: 'text-blue-700',  border: 'border-blue-200', dot: 'bg-blue-500' },
  2: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  3: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  4: { bg: 'bg-indigo-50',text: 'text-indigo-700',border: 'border-indigo-200',dot: 'bg-indigo-500' },
  5: { bg: 'bg-slate-100',text: 'text-slate-500', border: 'border-slate-200', dot: 'bg-slate-400' },
};

export const OPTIONAL_TEAM_STATUSES = new Set([0, 5]);

export const ALL_STATUSES = Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => ({
  value: Number(value),
  label,
}));
