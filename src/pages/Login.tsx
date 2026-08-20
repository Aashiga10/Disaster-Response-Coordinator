import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Activity,
  Radio,
  Users,
  LifeBuoy,
  Boxes,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_USERS } from '../data/mockData';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [email, setEmail] = useState('coordinator@disaster-eoc.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Chief Coordinator');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email, selectedRole);
      setIsLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  const handleDemoSelect = (userObj: typeof INITIAL_USERS[0]) => {
    setEmail(userObj.email);
    setSelectedRole(userObj.role);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left Form Section */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center shadow-lg shadow-rose-950/60 border border-rose-500/30">
                <ShieldAlert className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
                </span>
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-white tracking-wide flex items-center gap-2">
                  DISASTER RESPONSE COORDINATOR
                </h1>
                <p className="text-xs text-slate-400 font-mono">
                  State Emergency Operations Center (EOC) Command Grid
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Emergency Command Login
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Enter your credentials or choose a pre-configured response officer role.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Official Disaster Agency Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Security Passcode
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('For demonstration purposes, any passcode or demo account will grant immediate authenticated EOC access.')}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Forgot passcode?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-rose-600 focus:ring-rose-500"
                  />
                  <span>Keep terminal session persistent</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                id="login-submit-btn"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-spin" /> Authenticating Terminal...
                  </span>
                ) : (
                  <>
                    <span>Access Emergency Operations Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Role Selector */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Quick Demo Role Login
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {INITIAL_USERS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleDemoSelect(u)}
                    className={`p-2 rounded-xl text-left border transition-all text-xs ${
                      email === u.email
                        ? 'bg-rose-950/70 border-rose-500/60 text-rose-300 shadow-xs'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold truncate text-[11px] text-white">{u.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-400 truncate">{u.role.replace('Coordinator', 'Coord')}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 text-[11px] text-slate-500 font-mono flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit Encrypted EOC Protocol • ISO 22301 Disaster Ready</span>
          </div>
        </div>

        {/* Right Side Visual Panel */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/40 p-8 flex-col justify-between border-l border-slate-800 relative overflow-hidden">
          {/* Background circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950 border border-rose-600/40 text-rose-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              SEOC MONITORING ACTIVE
            </div>

            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              Real-Time National Disaster Grid
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Coordinating multi-agency field rescue missions, AI duplicate report clustering, GIS asset tracking, and emergency relief distribution during catastrophic weather and seismic events.
            </p>
          </div>

          {/* Quick metric widgets on the right */}
          <div className="space-y-2.5 my-6 relative z-10">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-600/20 text-rose-400">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Incident Pipeline</span>
                  <span className="text-[10px] text-slate-400">Instant Citizen & Sensor Intake</span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-rose-400">ACTIVE</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Rescue Battalion Sync</span>
                  <span className="text-[10px] text-slate-400">NDRF, SDRF & Marine Wings</span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400">8 TEAMS</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">AI Assistant Triage</span>
                  <span className="text-[10px] text-slate-400">Threat Estimation & Duplicate Deduplication</span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-indigo-400">ONLINE</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono flex justify-between items-center relative z-10">
            <span>Grid Node: IN-TN-CHN-01</span>
            <span>Version: 2026.4.2 EOC</span>
          </div>
        </div>
      </div>
    </div>
  );
};
