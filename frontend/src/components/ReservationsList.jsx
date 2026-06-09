
import React from 'react';
import { formatTimestamp } from '../utils/formatters';

export default function ReservationsList({ bookings, onCancelBooking }) {
  return (
    <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-2xl animation-fade-in w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Active Reservations Ledger</h2>
        <p className="text-slate-400 text-xs mt-1">
          Real-time monitoring network tracking active space deployments and timeline frames.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-slate-500 text-sm py-12 text-center border-2 border-dashed border-slate-800 rounded-xl">
          No active reservations discovered on the network grid.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Asset Space</th>
                <th className="py-3 px-4">Check-In Frame</th>
                <th className="py-3 px-4">Check-Out Frame</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-900/40 transition-colors duration-100">
                  {/* CHANGED: Removed "Jane Doe" text, now displaying clean ID strings */}
                  <td className="py-3.5 px-4 font-mono font-medium text-indigo-300">ID: {booking.user_id}</td>
                  <td className="py-3.5 px-4 text-slate-200 font-semibold">{booking.resource_name || `Asset #${booking.resource_id}`}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{formatTimestamp(booking.start_time)}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{formatTimestamp(booking.end_time)}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ● Confirmed
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button 
                      onClick={() => onCancelBooking(booking.id)}
                      className="text-rose-400 hover:text-rose-300 font-semibold hover:underline bg-transparent border-none cursor-pointer transition-colors"
                    >
                      Terminate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}