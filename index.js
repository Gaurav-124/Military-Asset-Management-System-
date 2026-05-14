import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/purchases', icon: '⊕', label: 'Purchases', roles: ['admin', 'logistics_officer'] },
  { to: '/transfers', icon: '⇄', label: 'Transfers', roles: ['admin', 'logistics_officer', 'base_commander'] },
  { to: '/assignments', icon: '◉', label: 'Assignments', roles: ['admin', 'base_commander'] },
  { to: '/audit-logs', icon: '☰', label: 'Audit Logs', roles: ['admin'] },
];

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const roleBadge = { admin: 'badge-admin', base_commander: 'badge-commander', logistics_officer: 'badge-logistics' };
  const roleLabel = { admin: 'Admin', base_commander: 'Base Commander', logistics_officer: 'Logistics Officer' };

  const visibleNav = NAV.filter(n => !n.roles || n.roles.includes(user?.role));

  return (
    <div className="flex h-screen overflow-hidden bg-military-900">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 bg-military-800 border-r border-military-700 flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="p-4 border-b border-military-700 flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-military-400 flex items-center justify-center text-military-300 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          {!collapsed && <div>
            <div className="font-mono font-bold text-military-100 text-sm tracking-widest">MAMS</div>
            <div className="text-military-400 text-xs">Asset Control</div>
          </div>}
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-military-400 hover:text-military-200">
            {collapsed ? '▶' : '◀'}
          </button>
        </div>

        {/* User info */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-military-700">
            <div className="text-sm font-semibold text-gray-200 truncate">{user?.name}</div>
            <span className={`${roleBadge[user?.role]} mt-1 inline-block`}>{roleLabel[user?.role]}</span>
            {user?.assignedBase && <div className="text-xs text-military-400 mt-1 font-mono">{user.assignedBase.name}</div>}
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1">
          {visibleNav.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-sm font-semibold ${
                  isActive ? 'bg-military-600 text-military-100 border-l-2 border-military-300' : 'text-military-300 hover:bg-military-700 hover:text-military-100'
                }`
              }>
              <span className="text-lg flex-shrink-0 font-mono">{item.icon}</span>
              {!collapsed && <span className="uppercase tracking-wider text-xs">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Status indicator */}
        {!collapsed && (
          <div className="px-4 py-2 border-t border-military-700">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-military-400 pulse-green flex-shrink-0" />
              <span className="text-xs text-military-400 font-mono">SYSTEM ONLINE</span>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="p-3 border-t border-military-700">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all w-full text-sm">
            <span className="text-lg flex-shrink-0">⏏</span>
            {!collapsed && <span className="uppercase tracking-wider text-xs font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 fade-in">{children}</div>
      </main>
    </div>
  );
}
