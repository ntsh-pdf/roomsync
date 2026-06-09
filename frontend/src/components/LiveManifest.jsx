import React from 'react';
import { formatTimestamp } from '../utils/formatters';

export default function LiveManifest({ selectedResource, startTime, endTime }) {
  return (
    <div className="bg-gradient-to-b from-slate-950/80 to-slate-950/20 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">
        Live Manifest Overview
      </h3>

      {selectedResource ? (
        <div className="space-y-4 animation-fade-in">
          <div>
            <h4 className="text-xl font-bold text-white tracking-tight">{selectedResource.name}</h4>
            <p className="text-xs text-slate-400 mt-1">
              {selectedResource.description || 'No alternative descriptions flagged for this structural asset.'}
            </p>
          </div>
          
          <div className="border-t border-slate-800/60 my-2 pt-3 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="block text-slate-500">Asset Safety Cap</span>
              <span className="font-semibold text-slate-200 text-sm">{selectedResource.capacity} Persons Max</span>
            </div>
            <div>
              <span className="block text-slate-500">Network Availability</span>
              <span className="inline-flex items-center text-emerald-400 font-semibold text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span> Active Online
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-slate-500 text-sm py-6 text-center border-2 border-dashed border-slate-800 rounded-xl">
          Awaiting target room input vectors...
        </div>
      )}

      {(startTime || endTime) && (
        <div className="mt-4 pt-4 border-t border-slate-800/60 text-xs space-y-2 animation-fade-in">
          <span className="block text-slate-500 font-bold uppercase tracking-widest text-[10px]">Configured Vectors</span>
          {startTime && (
            <div className="flex justify-between text-slate-300">
              <span>Start Frame:</span>
              <span className="font-mono text-indigo-300">{formatTimestamp(startTime)}</span>
            </div>
          )}
          {endTime && (
            <div className="flex justify-between text-slate-300">
              <span>End Frame:</span>
              <span className="font-mono text-purple-300">{formatTimestamp(endTime)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}