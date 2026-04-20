import React, { useEffect, useMemo, useState } from 'react';
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfYear,
  format,
  isAfter,
  isBefore,
  isValid,
  parseISO,
  startOfYear,
} from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import {
  CalendarPlus,
  CalendarRange,
  CheckCircle2,
  Dot,
  PencilLine,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage.js';

const DateRangeSelector = ({
  ranges,
  onAddRange,
  onUpdateRange,
  editingRangeIndex,
  onEditingHandled,
}) => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(null);
  const [draftEnd, setDraftEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [monthCount, setMonthCount] = useState(1);

  const locale = language === 'es' ? es : enUS;
  const exerciseStart = useMemo(() => startOfYear(new Date()), []);
  const exerciseEnd = useMemo(() => endOfYear(new Date()), []);
  const isEditing = editingRangeIndex !== null && editingRangeIndex !== undefined;
  const savedRangeCountLabel = language === 'es'
    ? `${ranges.length} ${ranges.length === 1 ? 'rango guardado' : 'rangos guardados'}`
    : `${ranges.length} ${ranges.length === 1 ? 'range saved' : 'ranges saved'}`;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const syncMonths = () => setMonthCount(mediaQuery.matches ? 2 : 1);

    syncMonths();
    mediaQuery.addEventListener('change', syncMonths);

    return () => mediaQuery.removeEventListener('change', syncMonths);
  }, []);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const rangeToEdit = ranges[editingRangeIndex];

    if (!rangeToEdit) {
      onEditingHandled?.();
      return;
    }

    setDraftStart(rangeToEdit.start);
    setDraftEnd(rangeToEdit.end);
    setStartInput(toInputValue(rangeToEdit.start));
    setEndInput(toInputValue(rangeToEdit.end));
    setHoverDate(null);
    setOpen(true);
  }, [editingRangeIndex, isEditing, onEditingHandled, ranges]);

  const occupiedRanges = useMemo(
    () => ranges.filter((_, index) => index !== editingRangeIndex),
    [editingRangeIndex, ranges],
  );

  const occupiedDayKeys = useMemo(() => {
    const keys = new Set();

    occupiedRanges.forEach((range) => {
      eachDayOfInterval({ start: range.start, end: range.end }).forEach((day) => {
        keys.add(toDayKey(day));
      });
    });

    return keys;
  }, [occupiedRanges]);

  const validationMessage = useMemo(() => {
    const hasPartialInput = startInput || endInput;

    if (!hasPartialInput && !draftStart && !draftEnd) {
      return null;
    }

    if (!draftStart) return t('dateSelector.validationMissingStart');
    if (!draftEnd) return t('dateSelector.validationMissingEnd');

    if (isOutsideExercise(draftStart, exerciseStart, exerciseEnd) || isOutsideExercise(draftEnd, exerciseStart, exerciseEnd)) {
      return t('dateSelector.validationOutsideExercise');
    }

    if (isBefore(draftEnd, draftStart)) {
      return t('dateSelector.validationOrder');
    }

    if (rangeContainsOccupiedDays(draftStart, draftEnd, occupiedDayKeys)) {
      return t('dateSelector.validationOverlap');
    }

    return null;
  }, [draftEnd, draftStart, endInput, exerciseEnd, exerciseStart, occupiedDayKeys, startInput, t]);

  const rangePreview = useMemo(() => {
    if (!draftStart) return undefined;

    if (draftEnd && !isBefore(draftEnd, draftStart) && !rangeContainsOccupiedDays(draftStart, draftEnd, occupiedDayKeys)) {
      return { from: draftStart, to: draftEnd };
    }

    if (hoverDate && !draftEnd && canBuildRange(draftStart, hoverDate, exerciseStart, exerciseEnd, occupiedDayKeys)) {
      const [from, to] = normalizeBounds(draftStart, hoverDate);
      return { from, to };
    }

    return { from: draftStart, to: draftStart };
  }, [draftEnd, draftStart, exerciseEnd, exerciseStart, hoverDate, occupiedDayKeys]);

  const canSubmit = !validationMessage && draftStart && draftEnd;
  const selectingEnd = Boolean(draftStart && !draftEnd);
  const resetDraft = () => {
    setDraftStart(null);
    setDraftEnd(null);
    setHoverDate(null);
    setStartInput('');
    setEndInput('');
  };

  const closeModal = () => {
    setOpen(false);
    resetDraft();
    onEditingHandled?.();
  };

  const openCreateModal = () => {
    onEditingHandled?.();
    resetDraft();
    setOpen(true);
  };

  const syncDraftDates = (nextStart, nextEnd) => {
    setDraftStart(nextStart);
    setDraftEnd(nextEnd);
    setStartInput(toInputValue(nextStart));
    setEndInput(toInputValue(nextEnd));
  };

  const handleDayClick = (day) => {
    if (isDayDisabled(day)) return;

    if (!draftStart || draftEnd) {
      syncDraftDates(day, null);
      setHoverDate(null);
      return;
    }

    if (!canBuildRange(draftStart, day, exerciseStart, exerciseEnd, occupiedDayKeys)) {
      return;
    }

    const [nextStart, nextEnd] = normalizeBounds(draftStart, day);
    syncDraftDates(nextStart, nextEnd);
    setHoverDate(null);
  };

  const handleStartInputChange = (value) => {
    setStartInput(value);

    const parsedDate = parseInputDate(value);
    setDraftStart(parsedDate);
  };

  const handleEndInputChange = (value) => {
    setEndInput(value);

    const parsedDate = parseInputDate(value);
    setDraftEnd(parsedDate);
  };

  const handleConfirm = () => {
    if (!canSubmit) {
      return;
    }

    const payload = {
      start: draftStart,
      end: draftEnd,
      days: differenceInCalendarDays(draftEnd, draftStart) + 1,
    };

    if (isEditing) {
      onUpdateRange(editingRangeIndex, payload);
    } else {
      onAddRange(payload);
    }

    closeModal();
  };

  const isDayDisabled = (date) => {
    if (isOutsideExercise(date, exerciseStart, exerciseEnd)) return true;
    if (occupiedDayKeys.has(toDayKey(date))) return true;

    if (draftStart && !draftEnd && toDayKey(date) !== toDayKey(draftStart)) {
      return !canBuildRange(draftStart, date, exerciseStart, exerciseEnd, occupiedDayKeys);
    }

    return false;
  };

  return (
    <>
      <Card className="rounded-[24px] border-border/70 bg-gradient-to-br from-card via-card to-muted/30 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <CalendarRange className="h-3.5 w-3.5" />
                {savedRangeCountLabel}
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  {t('dateSelector.title')}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t('dateSelector.description')}
                </p>
              </div>
            </div>

            <Button
              onClick={openCreateModal}
              className="h-12 rounded-full px-5 text-sm font-semibold shadow-md shadow-primary/15"
            >
              <CalendarPlus className="h-4 w-4" />
              {ranges.length > 0 ? t('dateSelector.addAnotherRange') : t('dateSelector.title')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : closeModal())}>
        <DialogContent className="h-[calc(100vh-1rem)] max-h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] gap-0 overflow-hidden rounded-[28px] border-border/80 p-0 sm:h-auto sm:max-h-[92vh] sm:max-w-5xl">
          <div className="flex h-full flex-col">
            <DialogHeader className="border-b border-border/70 px-5 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 text-left">
                  <DialogTitle className="text-xl font-bold tracking-tight sm:text-2xl">
                    {t('dateSelector.modalTitle')}
                  </DialogTitle>
                  <DialogDescription className="max-w-2xl text-sm leading-6">
                    {t('dateSelector.modalDescription')}
                  </DialogDescription>
                </div>

                {isEditing && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <PencilLine className="h-3.5 w-3.5" />
                    {t('dateSelector.editRange')}
                  </div>
                )}
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
              <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
                <div className="space-y-4">
                  <div className="rounded-[22px] border border-border/70 bg-muted/30 p-4">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                      <div className="space-y-2">
                        <label htmlFor="range-start-date" className="text-sm font-semibold text-foreground">
                          {t('dateSelector.startDate')}
                        </label>
                        <Input
                          id="range-start-date"
                          type="date"
                          value={startInput}
                          min={toInputValue(exerciseStart)}
                          max={toInputValue(exerciseEnd)}
                          onChange={(event) => handleStartInputChange(event.target.value)}
                          className="h-11 rounded-xl bg-background"
                        />
                        <p className="text-xs text-muted-foreground">{t('dateSelector.inputHint')}</p>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="range-end-date" className="text-sm font-semibold text-foreground">
                          {t('dateSelector.endDate')}
                        </label>
                        <Input
                          id="range-end-date"
                          type="date"
                          value={endInput}
                          min={toInputValue(exerciseStart)}
                          max={toInputValue(exerciseEnd)}
                          onChange={(event) => handleEndInputChange(event.target.value)}
                          className="h-11 rounded-xl bg-background"
                        />
                        <p className="text-xs text-muted-foreground">{t('dateSelector.inputHint')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-[22px] border border-border/70 bg-card p-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-foreground">
                      <Dot className="h-4 w-4" />
                      {selectingEnd
                        ? t('dateSelector.helperEnd')
                        : canSubmit
                          ? t('dateSelector.rangeReady')
                          : t('dateSelector.helperStart')}
                    </div>

                    <p className={cn(
                      'text-sm leading-6',
                      validationMessage ? 'text-destructive' : 'text-muted-foreground',
                    )}>
                      {validationMessage || t('dateSelector.helperUsedDates')}
                    </p>

                    {draftStart && draftEnd && !validationMessage && (
                      <div className="rounded-2xl bg-primary/8 p-4">
                        <p className="text-sm font-semibold text-foreground">{t('dateSelector.selectedRange')}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {format(draftStart, 'PPP', { locale })} <span className="mx-1 text-muted-foreground/60">→</span>
                          {format(draftEnd, 'PPP', { locale })}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-primary">
                          {differenceInCalendarDays(draftEnd, draftStart) + 1} {differenceInCalendarDays(draftEnd, draftStart) + 1 === 1 ? t('dateSelector.day') : t('dateSelector.days')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[24px] border border-border/70 bg-card p-3 sm:p-4">
                  <Calendar
                    mode="range"
                    locale={locale}
                    selected={rangePreview}
                    numberOfMonths={monthCount}
                    defaultMonth={draftStart || exerciseStart}
                    onDayClick={handleDayClick}
                    onDayMouseEnter={(day) => {
                      if (selectingEnd) {
                        setHoverDate(day);
                      }
                    }}
                    disabled={isDayDisabled}
                    startMonth={exerciseStart}
                    endMonth={exerciseEnd}
                    showOutsideDays={false}
                    className="mx-auto"
                    modifiers={{
                      occupied: (date) => occupiedDayKeys.has(toDayKey(date)),
                      outOfExercise: (date) => isOutsideExercise(date, exerciseStart, exerciseEnd),
                    }}
                    modifiersClassNames={{
                      occupied: 'bg-slate-100 text-slate-400 line-through border border-slate-200 aria-disabled:opacity-100 dark:bg-slate-800/70 dark:text-slate-500 dark:border-slate-700',
                      outOfExercise: 'opacity-30',
                    }}
                    classNames={{
                      months: 'flex flex-col gap-6 lg:flex-row',
                      month: 'rounded-2xl border border-border/60 bg-background p-3 shadow-sm',
                      month_caption: 'mb-3',
                      day: 'p-1',
                      day_button: 'h-10 w-10 rounded-xl text-sm font-medium',
                      range_start: 'bg-primary/15 rounded-2xl',
                      range_middle: 'bg-primary/10',
                      range_end: 'bg-primary/15 rounded-2xl',
                      today: 'rounded-xl border border-primary/30 bg-primary/5 text-primary',
                      disabled: 'text-muted-foreground',
                    }}
                  />

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/70 px-2 pt-4 text-xs text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-primary" />
                      {t('dateSelector.activeRange')}
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800/70" />
                      {t('dateSelector.usedDates')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-border/70 bg-background/95 px-4 py-4 sm:px-6">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="h-11 rounded-full px-5"
              >
                {t('dateSelector.cancel')}
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={!canSubmit}
                className="h-11 rounded-full px-5 font-semibold shadow-md shadow-primary/15"
              >
                <CheckCircle2 className="h-4 w-4" />
                {isEditing ? t('dateSelector.confirmEdit') : t('dateSelector.addRange')}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

function toDayKey(date) {
  return format(date, 'yyyy-MM-dd');
}

function toInputValue(date) {
  return date ? format(date, 'yyyy-MM-dd') : '';
}

function parseInputDate(value) {
  if (!value) return null;

  const parsedDate = parseISO(value);
  return isValid(parsedDate) ? parsedDate : null;
}

function normalizeBounds(firstDate, secondDate) {
  return isAfter(firstDate, secondDate)
    ? [secondDate, firstDate]
    : [firstDate, secondDate];
}

function isOutsideExercise(date, exerciseStart, exerciseEnd) {
  return isBefore(date, exerciseStart) || isAfter(date, exerciseEnd);
}

function rangeContainsOccupiedDays(start, end, occupiedDayKeys) {
  const [safeStart, safeEnd] = normalizeBounds(start, end);

  return eachDayOfInterval({ start: safeStart, end: safeEnd }).some((day) =>
    occupiedDayKeys.has(toDayKey(day)),
  );
}

function canBuildRange(start, end, exerciseStart, exerciseEnd, occupiedDayKeys) {
  return !isOutsideExercise(start, exerciseStart, exerciseEnd)
    && !isOutsideExercise(end, exerciseStart, exerciseEnd)
    && !rangeContainsOccupiedDays(start, end, occupiedDayKeys);
}

export default DateRangeSelector;
