
import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage.js';

const AdPlaceholder = ({ orientation = 'horizontal' }) => {
  const { t } = useLanguage();
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={cn(
      "flex items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/30",
      "text-xs font-semibold tracking-widest uppercase text-muted-foreground/40",
      isHorizontal ? "h-[100px] w-full" : "h-[300px] w-full"
    )}>
      {t('ads.advertisement')}
    </div>
  );
};

export default AdPlaceholder;
