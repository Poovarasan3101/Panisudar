import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  {
    label,
    error,
    options = [],
    placeholder,
    required = false,
    className = '',
    id,
    disabled = false,
    value,
    ...rest
  },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-slate-300"
        >
          {label}
          {required && <span className="ml-1 text-rose-400">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={[
            'w-full appearance-none rounded-xl border bg-[#161C28] px-3.5 py-2.5 pr-10',
            'text-sm text-white',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/70',
            'disabled:bg-slate-900/50 disabled:text-slate-500 disabled:cursor-not-allowed',
            error
              ? 'border-rose-500/80 focus:ring-rose-500/50 focus:border-rose-500'
              : 'border-white/10 hover:border-white/20',
            !value && placeholder ? 'text-slate-400' : 'text-white',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled hidden className="bg-[#161C28] text-slate-400">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#161C28] text-white">
              {opt.label}
            </option>
          ))}
        </select>

        <span className="absolute right-3.5 flex items-center justify-center text-slate-400 pointer-events-none">
          <ChevronDown className="h-4 w-4" />
        </span>
      </div>

      {error && (
        <p id={`${selectId}-error`} className="text-xs text-red-500 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
});

export default Select;
