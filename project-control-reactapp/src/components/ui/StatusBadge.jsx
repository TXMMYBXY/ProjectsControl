import { PROJECT_STATUS, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '../../utils/projectStatus.js';

// Надёжно приводим статус к числу — C# может слать число или строку ("0", "Backlog" и т.д.)
function resolveStatus(status) {
  if (status === null || status === undefined) return 0;

  // Уже число
  if (typeof status === 'number') return status;

  // Строка с числом: "0", "1", ...
  const asNum = Number(status);
  if (!isNaN(asNum) && String(asNum) === String(status).trim()) return asNum;

  // Строка-имя enum: "Backlog", "Active", ...
  if (PROJECT_STATUS[status] !== undefined) return PROJECT_STATUS[status];

  return 0;
}

export function StatusBadge({ status, size = 'md' }) {
  const numStatus = resolveStatus(status);
  const hasEntry = Object.prototype.hasOwnProperty.call(PROJECT_STATUS_COLORS, numStatus);
  const colors = hasEntry ? PROJECT_STATUS_COLORS[numStatus] : PROJECT_STATUS_COLORS[0];
  const label = hasEntry ? PROJECT_STATUS_LABELS[numStatus] : PROJECT_STATUS_LABELS[0];

  const sizeClass = size === 'sm'
    ? 'text-[10px] px-2 py-0.5'
    : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
      {label}
    </span>
  );
}
