
import React from 'react';
import { format } from 'date-fns';
import { Trash2, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage.js';

const RangeList = ({ ranges, onRemoveRange }) => {
  const { t } = useLanguage();

  return (
    <Card className="border-border bg-card rounded-[20px] overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          {t('rangeList.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {ranges.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            {t('rangeList.empty')}
          </div>
        ) : (
          <ul className="max-h-[300px] overflow-y-auto divide-y divide-border/50">
            {ranges.map((range, index) => (
              <li 
                key={index}
                className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50 group"
              >
                <div>
                  <div className="font-medium text-sm text-foreground">
                    {format(range.start, 'MMM d, yyyy')} <span className="text-muted-foreground mx-1">→</span> {format(range.end, 'MMM d, yyyy')}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {range.days} {range.days === 1 ? t('dateSelector.day') : t('dateSelector.days')}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveRange(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  aria-label={t('rangeList.delete')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default RangeList;
