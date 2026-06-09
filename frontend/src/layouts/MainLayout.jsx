import React from 'react';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white antialiased flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center p-2 shadow-lg shadow-indigo-500/20">
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
              RoomSync - Meeting Room Reservation System
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-slate-400 hidden sm:inline bg-slate-800/50 px-3 py-1 rounded-full border border-slate-800">
              Environment: Development
            </span>
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-indigo-400">
              RoomSync
            </div>
          </div>
        </div>
      </header>

      {/* Dynamic Content Body injection point */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        {children}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950/40 py-4 text-center text-xs text-slate-500 w-full">
        &copy; 2026 RoomSync Systems. All local system assets operational.
      </footer>
    </div>
  );
}