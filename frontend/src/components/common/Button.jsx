import React from 'react';
import ElectricBorder from './ElectricBorder';

const variantClasses = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:from-indigo-500 hover:to-cyan-500 shadow-md shadow-indigo-600/30 disabled:opacity-50',
  outline:
    'bg-[#161C28] text-slate-200 hover:bg-[#1C2434] hover:text-white border border-white/10 disabled:opacity-40',
  ghost:
    'bg-transparent text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-40',
  danger:
    'bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-600/30 disabled:opacity-50',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

const iconSizeClasses = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

function Spinner({ size = 'md' }) {
  return (
    <div
      className={`${iconSizeClasses[size]} animate-spin rounded-full border-2 border-current border-t-transparent`}
      role="status"
      aria-label="Loading"
    />
  );
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconRight,
  children,
  className = '',
  type = 'button',
  electric = true,
  electricColor,
  ...rest
}) {
  const isDisabled = disabled || loading;

  const innerContent = (
    <>
      {loading ? (
        <Spinner size={size} />
      ) : icon ? (
        <span className={iconSizeClasses[size]}>{icon}</span>
      ) : null}

      {children && <span className="truncate">{children}</span>}

      {!loading && iconRight && (
        <span className={iconSizeClasses[size]}>{iconRight}</span>
      )}
    </>
  );

  const radius = size === 'sm' ? 10 : size === 'lg' ? 16 : 12;

  const resolvedColor =
    electricColor ||
    (variant === 'danger'
      ? '#f43f5e'
      : variant === 'outline'
      ? '#818cf8'
      : '#38bdf8');

  const buttonElement = (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-semibold rounded-xl',
        'transition-all duration-150 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
        'disabled:cursor-not-allowed',
        variantClasses[variant] ?? variantClasses.primary,
        sizeClasses[size] ?? sizeClasses.md,
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {innerContent}
    </button>
  );

  if (electric && !isDisabled && variant !== 'ghost') {
    return (
      <ElectricBorder
        color={resolvedColor}
        speed={3}
        chaos={0.02}
        thickness={2}
        borderRadius={radius}
        className={fullWidth ? 'w-full' : ''}
        style={{ borderRadius: radius }}
      >
        {buttonElement}
      </ElectricBorder>
    );
  }

  return buttonElement;
}
