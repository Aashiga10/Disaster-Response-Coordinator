import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  FilePlus2,
  MapPin,
  Building2,
  LifeBuoy,
  Boxes,
  Users,
  BellRing,
  BarChart3,
  PhoneCall,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Crosshair
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const { user, incidents, alerts, operations, resources } = useApp();

  const criticalIncidentsCount = incidents.filter(
    i => i.severity === 'Critical' && i.status !== 'Resolved'
  ).length;

  const activeAlertsCount = alerts.filter(a => a.status === 'Active').length;
  const activeOpsCount = operations.filter(o => o.status !== 'Completed').length;
  const criticalResourceShortage = resources.some(r => r.criticalShortage);

  const emergencyNavItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/incidents',
      label: 'Live Incidents',
      icon: Radio,
      badge: criticalIncidentsCount > 0 ? { count: criticalIncidentsCount, color: 'bg-red-600 text-white font-bold' } : null
    },
    {
      to: '/report',
      label: 'Report Incident',
      icon: FilePlus2,
      badge: null
    },
    {
      to: '/verification',
      label: 'Verification Engine',
      icon: Crosshair,
      badge: { count: 'AI', color: 'bg-orange-600 text-white font-bold' }
    },
    {
      to: '/map',
      label: 'Disaster Map',
      icon: MapPin,
      badge: null
    }
  ];

  const coordinationNavItems = [
    {
      to: '/rescue',
      label: 'Rescue Operations',
      icon: LifeBuoy,
      badge: activeOpsCount > 0 ? { count: activeOpsCount, color: 'bg-amber-500 text-slate-950 font-bold' } : null
    },
    {
      to: '/resources',
      label: 'Resources',
      icon: Boxes,
      badge: criticalResourceShortage ? { count: '!', color: 'bg-red-500 text-white font-bold' } : null
    },
    {
      to: '/volunteers',
      label: 'Volunteers',
      icon: Users,
      badge: null
    },
    {
      to: '/affected-areas',
      label: 'Affected Areas',
      icon: Building2,
      badge: null
    },
    {
      to: '/alerts',
      label: 'Alerts',
      icon: BellRing,
      badge: activeAlertsCount > 0 ? { count: activeAlertsCount, color: 'bg-red-600 text-white font-bold' } : null
    },
    {
      to: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      to: '/contacts',
      label: 'Emergency Contacts',
      icon: PhoneCall,
      badge: null
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0f172a] text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800 ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 bg-[#1e293b] border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm flex-shrink-0">
              D
            </div>

            {!collapsed && (
              <span className="font-bold text-white tracking-tight text-sm truncate">
                DR COORDINATOR
              </span>
            )}
          </div>

          {/* Desktop collapse button */}
          <button
            type="button"
            id="toggle-sidebar-btn"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto py-3">
          {/* Section 1: Emergency Console */}
          {!collapsed && (
            <div className="px-6 py-2 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
              Emergency Console
            </div>
          )}

          <div className="space-y-0.5 mb-3">
            {emergencyNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  id={`nav-${item.to.replace('/', '')}`}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#334155] text-white border-r-4 border-red-500 font-semibold'
                        : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
                    } ${collapsed ? 'justify-center px-0' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0 opacity-80" />
                  
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}

                  {!collapsed && item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 font-bold ${item.badge.color}`}
                    >
                      {item.badge.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Section 2: Coordination */}
          {!collapsed && (
            <div className="mt-2 px-6 py-2 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
              Coordination
            </div>
          )}

          <div className="space-y-0.5">
            {coordinationNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  id={`nav-${item.to.replace('/', '')}`}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#334155] text-white border-r-4 border-red-500 font-semibold'
                        : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
                    } ${collapsed ? 'justify-center px-0' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0 opacity-80" />
                  
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}

                  {!collapsed && item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 font-bold ${item.badge.color}`}
                    >
                      {item.badge.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0f172a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-xs">{user?.name ? user.name[0] : 'A'}</span>
              )}
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Arun Kumar'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.role || 'Response Lead'}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
