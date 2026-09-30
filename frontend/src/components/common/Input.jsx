import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon,
    iconRight,
    required = false,
    className = '',
    id,
    disabled = false,
    ...rest
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-300"
        >
          {label}
          {required && <span className="ml-1 text-rose-400">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 flex items-center justify-center text-slate-400 pointer-events-none">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={[
            'w-full rounded-xl border bg-[#161C28] px-3.5 py-2.5 text-sm text-white',
            'placeholder:text-slate-400',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/70',
            'disabled:bg-slate-900/50 disabled:text-slate-500 disabled:cursor-not-allowed',
            error
              ? 'border-rose-500/80 focus:ring-rose-500/50 focus:border-rose-500'
              : 'border-white/10 hover:border-white/20',
            icon ? 'pl-10' : '',
            iconRight ? 'pr-10' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />

        {iconRight && (
          <span className="absolute right-3 flex items-center justify-center text-gray-400 pointer-events-none">
            {iconRight}
          </span>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-500 mt-0.5">
          {error}
        </p>
      )}

      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-gray-500 mt-0.5">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
