
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage.js';

const ProgressBar = ({ totalDays }) => {
  const { t } = useLanguage();
  const limit = 183;
  const percentage = Math.min((totalDays / limit) * 100, 100);
  const [isPulsing, setIsPulsing] = useState(false);
  
  useEffect(() => {
    if (totalDays > 0) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [totalDays]);

  const getStatus = () => {
    if (totalDays <= 150) return { color: 'success', label: t('progress.safe') };
    if (totalDays <= 183) return { color: 'warning', label: t('progress.approaching') };
    return { color: 'destructive', label: t('progress.over') };
  };

  const status = getStatus();

  return (
    <div className="double-shell">
      <div className="double-shell-core space-y-4 p-5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium uppercase tracking-[0.2em] text-muted-foreground">{t('progress.title')}</span>
        <span className="font-semibold text-foreground">
          {totalDays} / {limit} {t('dateSelector.days')}
        </span>
      </div>
      
      <div className="relative h-10 overflow-hidden rounded-full border border-white/8 bg-white/[0.04]">
        <motion.div
          className={cn(
            "h-full rounded-full transition-colors duration-300",
            status.color === 'success' && "bg-[linear-gradient(90deg,rgba(16,185,129,0.84),rgba(6,182,212,0.92))]",
            status.color === 'warning' && "bg-[linear-gradient(90deg,rgba(251,191,36,0.82),rgba(245,158,11,0.96))]",
            status.color === 'destructive' && "bg-[linear-gradient(90deg,rgba(251,113,133,0.82),rgba(239,68,68,0.95))]",
            isPulsing && "animate-pulse-subtle"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            "text-xs font-semibold transition-colors duration-300",
            percentage > 50 
              ? status.color === 'warning' 
                ? "text-[hsl(var(--warning-foreground))]"
                : "text-white"
              : "text-foreground"
          )}>
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className={cn(
          "rounded-full px-3 py-1.5 font-medium uppercase tracking-[0.18em] transition-all duration-300",
          status.color === 'success' && "bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]",
          status.color === 'warning' && "bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning-foreground))]",
          status.color === 'destructive' && "bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))]"
        )}>
          {status.label}
        </span>
      </div>
      </div>
    </div>
  );
};

export default ProgressBar;
