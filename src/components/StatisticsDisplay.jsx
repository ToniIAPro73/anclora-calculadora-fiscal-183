
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage.js';

const StatisticsDisplay = ({ totalDays }) => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  
  const limit = 183;
  const remaining = Math.max(limit - totalDays, 0);
  const percentage = Math.min((totalDays / limit) * 100, 100);
  
  const getStatus = () => {
    if (totalDays <= 150) return { color: 'success', label: t('progress.safe'), textColor: 'text-[hsl(var(--primary))]' };
    if (totalDays <= 183) return { color: 'warning', label: t('progress.approaching'), textColor: 'text-[hsl(var(--warning-foreground))]' };
    return { color: 'destructive', label: t('progress.over'), textColor: 'text-[hsl(var(--destructive))]' };
  };

  const status = getStatus();

  const stats = [
    {
      label: t('stats.totalDays'),
      value: totalDays,
      suffix: totalDays === 1 ? t('dateSelector.day') : t('dateSelector.days'),
    },
    {
      label: t('stats.remainingDays'),
      value: remaining,
      suffix: remaining === 1 ? t('dateSelector.day') : t('dateSelector.days'),
      color: status.textColor
    },
    {
      label: t('stats.limitUsage'),
      value: percentage.toFixed(1),
      suffix: '%',
      color: status.textColor
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="statistics-card p-6 flex flex-col items-center justify-between min-h-[140px] text-center"
          >
            <div className="text-xs font-medium text-muted-foreground text-balance mt-2">
              {stat.label}
            </div>
            
            <motion.div
              key={stat.value}
              initial={shouldReduceMotion ? { scale: 1 } : { scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={cn(
                "font-bold flex items-baseline gap-1 justify-center mb-2",
                stat.color || "text-foreground"
              )}
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
            >
              {stat.value}
              <span className="text-lg font-semibold opacity-80">
                {stat.suffix}
              </span>
            </motion.div>
          </div>
        ))}
      </div>

      <div className={cn(
        "statistics-card p-6",
        status.color === 'success' && "bg-[hsl(var(--primary)/0.05)] border-[hsl(var(--primary)/0.2)]",
        status.color === 'warning' && "bg-[hsl(var(--warning)/0.05)] border-[hsl(var(--warning)/0.2)]",
        status.color === 'destructive' && "bg-[hsl(var(--destructive)/0.05)] border-[hsl(var(--destructive)/0.2)]"
      )}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('stats.status')}</span>
          <motion.span
            key={status.label}
            initial={shouldReduceMotion ? { scale: 1 } : { scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
              "text-lg font-bold",
              status.textColor
            )}
          >
            {status.label}
          </motion.span>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDisplay;
