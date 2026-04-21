
import React from 'react';
import { ArrowUpRight, WarningCircle } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

const SummaryCard = ({ title, value, percentage, status }) => {
  const statusColorMap = {
    safe: 'text-[hsl(var(--success))] bg-[hsl(var(--success)/0.1)] border-[hsl(var(--success)/0.16)]',
    warning: 'text-[hsl(var(--warning-foreground))] bg-[hsl(var(--warning)/0.12)] border-[hsl(var(--warning)/0.18)]',
    destructive: 'text-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.12)] border-[hsl(var(--destructive)/0.18)]'
  };

  const currentStatusColor = statusColorMap[status?.color] || 'text-foreground bg-card border-border';

  return (
    <div className="double-shell lift-on-hover">
      <div className="double-shell-core p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              {title}
            </p>
            <div className="text-4xl font-[650] tracking-[-0.06em] text-foreground sm:text-5xl">
              {value}
            </div>
            {percentage !== undefined && (
              <div className="text-sm font-medium text-muted-foreground">
                {percentage}%
              </div>
            )}
          </div>
          <div className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]', currentStatusColor)}>
            {status?.color === 'warning' || status?.color === 'destructive'
              ? <WarningCircle size={14} weight="fill" />
              : <ArrowUpRight size={14} weight="bold" />}
            {status?.label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
