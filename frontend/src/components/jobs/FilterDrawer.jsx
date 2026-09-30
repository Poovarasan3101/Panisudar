import React from 'react';
import FilterSidebar from './FilterSidebar';
import { X } from 'lucide-react';

export default function FilterDrawer({ isOpen, onClose, filters, onChange, onClear }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0B0D12] border-l border-white/10 shadow-2xl flex flex-col text-white">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">Filter Jobs</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <FilterSidebar filters={filters} onChange={onChange} onClear={onClear} />
          </div>

          <div className="p-4 border-t border-white/10 bg-[#121620] flex gap-3">
            <button
              onClick={onClear}
              className="w-1/2 py-2.5 px-4 rounded-xl border border-white/10 text-slate-300 font-medium hover:bg-white/5 text-sm transition-colors"
            >
              Reset All
            </button>
            <button
              onClick={onClose}
              className="w-1/2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-md transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
