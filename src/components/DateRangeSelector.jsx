
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarPlus as CalendarIcon } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage.js';

const DateRangeSelector = ({ onAddRange }) => {
  const { t } = useLanguage();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleAddRange = () => {
    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate) + 1;
      onAddRange({
        start: startDate,
        end: endDate,
        days: days
      });
      setStartDate(null);
      setEndDate(null);
    }
  };

  const isAddDisabled = !startDate || !endDate || endDate < startDate;

  return (
    <Card className="shadow-sm border-border bg-card rounded-[20px]">
      <CardHeader>
        <CardTitle>{t('dateSelector.title')}</CardTitle>
        <CardDescription>{t('dateSelector.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('dateSelector.startDate')}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-input transition-colors",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : t('dateSelector.pickDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('dateSelector.endDate')}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-input transition-colors",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : t('dateSelector.pickDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => startDate && date < startDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {startDate && endDate && endDate >= startDate && (
          <div className="text-sm font-medium text-primary bg-primary/10 p-3 rounded-lg">
            {t('dateSelector.selectedRange')}: {differenceInDays(endDate, startDate) + 1} {t('dateSelector.days')}
          </div>
        )}

        <Button 
          onClick={handleAddRange} 
          disabled={isAddDisabled}
          className="w-full active:scale-[0.98] transition-transform"
        >
          {t('dateSelector.addRange')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DateRangeSelector;
