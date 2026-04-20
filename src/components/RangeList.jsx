import React from 'react';
import { format } from 'date-fns';
import { CalendarDays, PencilLine, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage.js';

const RangeList = ({ ranges, onRemoveRange, onEditRange }) => {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden rounded-[24px] border-border/70 bg-card shadow-sm">
      <CardHeader className="border-b border-border/60 bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className="h-5 w-5 text-primary" />
          {t('rangeList.title')}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {ranges.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            {t('rangeList.empty')}
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {ranges.map((range, index) => (
              <li
                key={`${range.start.toISOString()}-${range.end.toISOString()}-${index}`}
                className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                      {range.days} {range.days === 1 ? t('dateSelector.day') : t('dateSelector.days')}
                    </span>
                  </div>

                  <div className="grid gap-2 text-sm text-foreground sm:grid-cols-3 sm:gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {t('rangeList.from')}
                      </p>
                      <p className="mt-1 font-medium">{format(range.start, 'yyyy/MM/dd')}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {t('rangeList.to')}
                      </p>
                      <p className="mt-1 font-medium">{format(range.end, 'yyyy/MM/dd')}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {t('rangeList.duration')}
                      </p>
                      <p className="mt-1 font-medium">
                        {range.days} {range.days === 1 ? t('dateSelector.day') : t('dateSelector.days')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEditRange(index)}
                    className="rounded-full"
                  >
                    <PencilLine className="h-4 w-4" />
                    {t('rangeList.edit')}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveRange(index)}
                    className="rounded-full text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('rangeList.delete')}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default RangeList;
