import React from 'react';
import { X } from 'lucide-react';

const sizeConfig = {
  sm: {
    badge: 'px-2 py-0.5 text-xs gap-1',
    icon: 'h-3 w-3',
    btn: 'h-3.5 w-3.5',
  },
  md: {
    badge: 'px-3 py-1 text-sm gap-1.5',
    icon: 'h-3.5 w-3.5',
    btn: 'h-4 w-4',
  },
};

// ─── SkillBadge ──────────────────────────────────────────────────────────────

export function SkillBadge({ skill, onRemove, size = 'md' }) {
  const cfg = sizeConfig[size] ?? sizeConfig.md;

  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full',
        'bg-indigo-100 text-indigo-700',
        cfg.badge,
      ].join(' ')}
    >
      {skill}

      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          aria-label={`Remove ${skill}`}
          className={[
            'inline-flex items-center justify-center rounded-full',
            'text-indigo-400 hover:text-indigo-700 hover:bg-indigo-200',
            'transition-colors duration-100 focus:outline-none',
            cfg.btn,
          ].join(' ')}
        >
          <X className={cfg.icon} />
        </button>
      )}
    </span>
  );
}

// ─── SkillList ───────────────────────────────────────────────────────────────

export function SkillList({ skills = [], onRemove, size = 'md', className = '' }) {
  if (!skills.length) return null;

  return (
    <div className={['flex flex-wrap gap-2', className].join(' ')}>
      {skills.map((skill) => (
        <SkillBadge
          key={skill}
          skill={skill}
          size={size}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default SkillBadge;
