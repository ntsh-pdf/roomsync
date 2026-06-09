import React from 'react';

export default function BookingForm({ 
  resources, selectedResourceId, setSelectedResourceId, 
  startTime, setStartTime, endTime, setEndTime, 
  handleBookingSubmit, isSubmitting 
}) {
  return (
    <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Reserve a Workspace
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Select your required layout asset, input your timeline structure, and deploy instantly.
        </p>
      </div>

      <form onSubmit={handleBookingSubmit} className="space-y-6">
        {/* Resource Selection Dropdown */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Available Spaces & Assets
          </label>
          <div className="relative">
            <select 
              value={selectedResourceId} 
              onChange={(e) => setSelectedResourceId(e.target.value)} 
              required
              className="w-full appearance-none bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150 cursor-pointer"
            >
              <option value="" className="text-slate-500">-- Click to reveal assets --</option>
              {resources.map(item => (
                <option key={item.id} value={item.id} className="bg-slate-950 text-slate-200">
                  {item.name} (Max Cap: {item.capacity} Pax)
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              ▼
            </div>
          </div>
        </div>

        {/* Dynamic Timestamp Ranges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Check-In Timestamp
            </label>
            <input 
              type="datetime-local" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
              required 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150 [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Check-Out Timestamp
            </label>
            <input 
              type="datetime-local" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
              required 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150 [color-scheme:dark]"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition duration-150 transform active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center space-x-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span>{isSubmitting ? 'Processing Transaction...' : 'Confirm Dynamic Reservation'}</span>
        </button>
      </form>
    </div>
  );
}