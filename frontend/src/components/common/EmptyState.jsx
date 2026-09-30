import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon,
  title = 'Nothing here yet',
  description = '',
  action,
  className = '',
}) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl bg-[#121620]/60 border border-white/5',
        className,
      ].join(' ')}
    >
      {/* Icon circle */}
      {icon && (
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-cyan-400 mb-5 shadow-lg shadow-cyan-500/5">
          {React.isValidElement(icon)
            ? React.cloneElement(icon, {
                className: `h-8 w-8 ${icon.props.className ?? ''}`.trim(),
              })
            : icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-1">
          {description}
        </p>
      )}

      {/* Optional action button */}
      {action && (
        <div className="mt-6">
          <Button onClick={action.onClick} variant="primary" size="md">
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
