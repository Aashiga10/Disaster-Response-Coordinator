import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { AlertBanner } from './AlertBanner';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* Search Modal */}
      <GlobalSearchModal />

      {/* Persistent Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Container adjusting for sidebar */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Navbar */}
        <Navbar collapsed={collapsed} setMobileOpen={setMobileOpen} />

        {/* Global Emergency Alert Banner */}
        <AlertBanner />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Emergency Footer */}
        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-slate-600">State Emergency Operations Center (SEOC) Active Multi-Agency Grid</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
            <span>System Status: 99.98% Normal</span>
            <span>Satellite Uplink: Locked</span>
            <span>Node: TN-EOC-PRIMARY-01</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
