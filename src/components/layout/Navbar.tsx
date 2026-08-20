import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Radio,
  AlertTriangle,
  User as UserIcon,
  LogOut,
  Sparkles,
  Shield,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronDown,
  Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface NavbarProps {
  collapsed: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ collapsed, setMobileOpen }) => {
  const navigate = useNavigate();
  const {
    user,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    logout,
    switchUserRole,
    setIsSearchModalOpen,
    triggerSurgeSimulation,
    incidents,
    alerts
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalIncidentsCount = incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: UserRole[] = [
    'Chief Coordinator',
    'Field Commander',
    'Logistics Officer',
    'Medical Lead',
    'Volunteer Coordinator'
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shadow-xs">
      {/* Left side: Hamburger + Search Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          type="button"
          id="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Box */}
        <div className="relative w-full max-w-md">
          <span className="absolute left-3.5 top-2.5 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search incidents, locations, teams..."
            onClick={() => setIsSearchModalOpen(true)}
            readOnly
            className="w-full bg-slate-100 hover:bg-slate-200/70 cursor-pointer border-none rounded-md py-2 pl-10 pr-12 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-400 transition-all"
          />
          <kbd className="hidden sm:inline-flex absolute right-2.5 top-2.5 items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side: Emergency Status, Quick Simulation, Notifications, Settings, Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Disaster Status Pill */}
        <div
          onClick={() => navigate('/incidents')}
          className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full border border-red-100 text-xs font-bold cursor-pointer hover:bg-red-100 transition-colors shadow-2xs"
          title="Click to view critical incidents"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          <span>{criticalIncidentsCount || 3} CRITICAL ALERTS</span>
        </div>

        {/* Simulation Demo Trigger */}
        <button
          type="button"
          id="simulate-surge-btn"
          onClick={triggerSurgeSimulation}
          className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-colors"
          title="Simulates a real-time sudden flash flood alert to test platform reaction"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Simulate Surge
        </button>

        {/* Action icons */}
        <div className="flex items-center gap-3 text-slate-500">
          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              id="notifications-bell-btn"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-md hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Open notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-[16px] px-0.5 text-[9px] font-bold text-white bg-red-600 rounded-full border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-bold text-slate-900">Emergency Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm">
                      No active notifications
                    </div>
                  ) : (
                    notifications.map((notif, idx) => (
                      <div
                        key={notif.id ? `${notif.id}-${idx}` : `notif-${idx}`}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.link) {
                            navigate(notif.link);
                            setIsNotifOpen(false);
                          }
                        }}
                        className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                          !notif.read ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="mt-1">
                          {notif.type === 'critical' && (
                            <span className="flex h-2.5 w-2.5 rounded-full bg-red-600"></span>
                          )}
                          {notif.type === 'warning' && (
                            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                          )}
                          {notif.type === 'info' && (
                            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                          )}
                          {notif.type === 'success' && (
                            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <p className={`text-xs font-semibold truncate ${!notif.read ? 'text-slate-900' : 'text-slate-600'}`}>
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/alerts');
                      setIsNotifOpen(false);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
                  >
                    View all broadcasted alerts <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Settings Icon */}
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="p-2 rounded-md hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="System Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* User Role & Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            id="user-profile-menu-btn"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-md hover:bg-slate-100 transition-all text-left"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 text-white font-bold text-xs flex-shrink-0 flex items-center justify-center border border-slate-200">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name ? user.name[0] : 'A'}</span>
              )}
            </div>

            <div className="hidden sm:flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                {user?.name || 'Arun Kumar'}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold truncate">
                {user?.role || 'Response Lead'}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3 border-b border-slate-100 mb-1.5">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider mt-0.5">{user?.agency}</p>
              </div>

              {/* Role Switcher */}
              <div className="px-2 py-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Switch Active Role
                </span>
                <div className="space-y-0.5">
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        switchUserRole(r);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                        user?.role === r
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>{r}</span>
                      {user?.role === r && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 mt-2 pt-1.5">
                <button
                  type="button"
                  id="navbar-logout-btn"
                  onClick={() => {
                    logout();
                    navigate('/login');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out of EOC
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
