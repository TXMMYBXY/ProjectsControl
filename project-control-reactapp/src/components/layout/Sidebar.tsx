import { NavLink } from 'react-router-dom';
import { FolderKanban, Users, LayoutDashboard, Settings } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Дашборд', end: true },
  { to: '/projects', icon: FolderKanban, label: 'Проекты', end: false },
  { to: '/employees', icon: Users, label: 'Сотрудники', end: false },
];

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobile, onClose }: SidebarProps) {
  return (
    <aside className={`flex flex-col h-full bg-white border-r border-gray-100 ${mobile ? 'w-full' : 'w-64'}`}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <FolderKanban size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Контроль</p>
            <p className="text-xs text-gray-400">проектов</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${isActive
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400">
          <Settings size={18} />
          <div>
            <p className="text-xs text-gray-500 font-medium">Авторизация</p>
            <p className="text-xs text-gray-400">В разработке</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
