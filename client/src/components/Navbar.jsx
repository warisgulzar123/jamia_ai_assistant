import React from 'react';
import { Search, ShieldCheck, User, LogOut, BookOpen, CheckCircle2 } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuthModal,
  onLogoutUser,
  adminAuthenticated,
  onLogoutAdmin,
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-emerald-900/40 w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-3 py-3 sm:px-6 w-full max-w-full overflow-x-hidden gap-y-2">
        
        {/* Left: Institution Brand & Logo */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group min-w-0 shrink"
          onClick={() => setActiveTab && setActiveTab('search')}
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-950 p-1.5 sm:p-2 flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-500/30 shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-full h-full text-emerald-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-base sm:text-xl font-bold tracking-tight text-white font-arabic-heading leading-tight truncate">
                جامعۃ المدینہ
              </span>
              <span className="text-emerald-400 font-semibold text-xs sm:text-sm hidden md:inline">
                | Jamiatul Madina
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 truncate">
              دعوتِ اسلامی • Dawat-e-Islami
            </p>
          </div>
        </div>

        {/* Right: User Auth / Profile Place */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Admin Mode Badge & Logout (Only visible if admin is authenticated) */}
          {adminAuthenticated && (
            <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-xs text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium text-xs">Admin</span>
              <button
                onClick={onLogoutAdmin}
                title="Logout Administrator"
                className="ml-0.5 text-slate-400 hover:text-rose-400 transition p-0.5"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Regular User Profile */}
          {currentUser && !adminAuthenticated ? (
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 border border-slate-800 px-2 sm:px-2.5 py-1 rounded-xl">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center text-white font-bold text-xs shadow-inner shrink-0">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block text-left max-w-[110px] truncate">
                <div className="text-xs font-semibold text-white flex items-center gap-1 truncate">
                  <span className="truncate">{currentUser.name}</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                </div>
                <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
              </div>
              <button
                onClick={onLogoutUser}
                title="Logout"
                className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : !currentUser && !adminAuthenticated ? (
            /* Compact Sign In Button on < sm screens to prevent 320px overflow */
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-medium bg-emerald-900/30 hover:bg-emerald-800/40 text-emerald-300 border border-emerald-700/40 hover:border-emerald-500/60 transition shadow-sm shrink-0 active:scale-95"
            >
              <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="sm:hidden">Sign In</span>
              <span className="hidden sm:inline">Sign In / Register</span>
            </button>
          ) : null}
        </div>

        {/* Admin Navigation Switch ONLY if admin is authenticated */}
        {adminAuthenticated && (
          <nav className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-slate-900/90 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-emerald-800/60 shadow-inner mt-1 max-w-full">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300 shrink-0" />
              <span>AI Search</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-emerald-700 to-slate-800 text-white shadow-md shadow-emerald-900/30 ring-1 ring-emerald-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
              <span>Admin Dashboard</span>
              <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 font-mono font-bold">ON</span>
            </button>
          </nav>
        )}

      </div>
    </header>
  );
}
