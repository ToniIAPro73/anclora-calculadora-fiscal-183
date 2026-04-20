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
  startOfMonth,
  startOfYear,
} from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import {
  CalendarPlus,
  CalendarRange,
  CheckCircle2,
  Dot,
  PencilLine,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter as AlertDialogFooterActions,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const locale = language === 'es' ? es : enUS;
  const today = useMemo(() => new Date(), []);
  const initialMonth = useMemo(() => startOfMonth(today), [today]);
  const exerciseStart = useMemo(() => startOfYear(new Date()), []);
  const exerciseEnd = useMemo(() => endOfYear(new Date()), []);
  const isEditing = editingRangeIndex !== null && editingRangeIndex !== undefined;
  const currentEditingRange = isEditing ? ranges[editingRangeIndex] : null;
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

    if (!currentEditingRange) {
      onEditingHandled?.();
      return;
    }

    setDraftStart(currentEditingRange.start);
    setDraftEnd(currentEditingRange.end);
    setStartInput(toInputValue(currentEditingRange.start));
    setEndInput(toInputValue(currentEditingRange.end));
    setHoverDate(null);
    setVisibleMonth(startOfMonth(currentEditingRange.start));
    setOpen(true);
  }, [currentEditingRange, isEditing, onEditingHandled]);

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
  const initialStartInput = currentEditingRange ? toInputValue(currentEditingRange.start) : '';
  const initialEndInput = currentEditingRange ? toInputValue(currentEditingRange.end) : '';
  const initialVisibleMonth = currentEditingRange ? startOfMonth(currentEditingRange.start) : initialMonth;
  const startInputMin = toInputValue(exerciseStart);
  const startInputMax = draftEnd ? toInputValue(draftEnd) : toInputValue(exerciseEnd);
  const endInputMin = draftStart ? toInputValue(draftStart) : toInputValue(exerciseStart);
  const endInputMax = toInputValue(exerciseEnd);

  const applyInitialDraftState = () => {
    if (currentEditingRange) {
      setDraftStart(currentEditingRange.start);
      setDraftEnd(currentEditingRange.end);
      setStartInput(toInputValue(currentEditingRange.start));
      setEndInput(toInputValue(currentEditingRange.end));
      setVisibleMonth(startOfMonth(currentEditingRange.start));
    } else {
      setDraftStart(null);
      setDraftEnd(null);
      setStartInput('');
      setEndInput('');
      setVisibleMonth(initialMonth);
    }

    setHoverDate(null);
  };

  const resetDraft = () => {
    applyInitialDraftState();
  };

  const hasUnsavedChanges = Boolean(
    hoverDate
    || startInput !== initialStartInput
    || endInput !== initialEndInput
    || toInputValue(draftStart) !== initialStartInput
    || toInputValue(draftEnd) !== initialEndInput
    || toDayKey(visibleMonth) !== toDayKey(initialVisibleMonth),
  );

  const closeModal = () => {
    setOpen(false);
    setResetConfirmOpen(false);
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

    if (parsedDate) {
      setVisibleMonth(startOfMonth(parsedDate));

      if (draftEnd && isBefore(draftEnd, parsedDate)) {
        setDraftEnd(null);
        setEndInput('');
      }
    }
  };

  const handleEndInputChange = (value) => {
    setEndInput(value);

    const parsedDate = parseInputDate(value);
    setDraftEnd(parsedDate);

    if (parsedDate) {
      setVisibleMonth(startOfMonth(parsedDate));
    }
  };

  const handleResetModal = () => {
    if (hasUnsavedChanges) {
      setResetConfirmOpen(true);
      return;
    }

    resetDraft();
  };

  const confirmResetModal = () => {
    resetDraft();
    setResetConfirmOpen(false);
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
        <DialogContent
          showClose={false}
          className="h-[calc(100vh-1rem)] max-h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] gap-0 overflow-hidden rounded-[28px] border-border/80 p-0 sm:h-auto sm:max-h-[92vh] sm:max-w-[1140px]"
        >
          <div className="flex h-full flex-col">
            <DialogHeader className="border-b border-border/70 px-5 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 text-left pr-2">
                  <DialogTitle className="text-xl font-bold tracking-tight sm:text-2xl">
                    {t('dateSelector.modalTitle')}
                  </DialogTitle>
                  <DialogDescription className="max-w-2xl text-sm leading-6">
                    {t('dateSelector.modalDescription')}
                  </DialogDescription>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing && (
                    <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      <PencilLine className="h-3.5 w-3.5" />
                      {t('dateSelector.editRange')}
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={closeModal}
                    className="h-10 w-10 rounded-full border border-border/70 bg-background/70 hover:bg-accent"
                    aria-label={t('dateSelector.cancel')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {isEditing && (
                <div className="mt-3 sm:hidden">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <PencilLine className="h-3.5 w-3.5" />
                    {t('dateSelector.editRange')}
                  </div>
                </div>
              )}
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
              <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
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
                          min={startInputMin}
                          max={startInputMax}
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
                          min={endInputMin}
                          max={endInputMax}
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
                          {toInputValue(draftStart)} <span className="mx-1 text-muted-foreground/60">→</span>
                          {toInputValue(draftEnd)}
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
                    month={visibleMonth}
                    weekStartsOn={language === 'es' ? 1 : 0}
                    onDayClick={handleDayClick}
                    onMonthChange={setVisibleMonth}
                    onDayMouseEnter={(day) => {
                      if (selectingEnd) {
                        setHoverDate(day);
                      }
                    }}
                    disabled={isDayDisabled}
                    startMonth={exerciseStart}
                    endMonth={exerciseEnd}
                    showOutsideDays={false}
                    className="mx-auto w-full [--cell-size:2.5rem]"
                    modifiers={{
                      occupied: (date) => occupiedDayKeys.has(toDayKey(date)),
                      outOfExercise: (date) => isOutsideExercise(date, exerciseStart, exerciseEnd),
                    }}
                    modifiersClassNames={{
                      occupied: 'bg-slate-100 text-slate-400 line-through border border-slate-200 aria-disabled:opacity-100 dark:bg-slate-800/70 dark:text-slate-500 dark:border-slate-700',
                      outOfExercise: 'opacity-30',
                    }}
                    classNames={{
                      root: 'w-full',
                      months: 'grid grid-cols-1 gap-4 xl:grid-cols-2',
                      month: 'relative min-w-0 rounded-2xl border border-border/60 bg-background p-3 pt-14 shadow-sm',
                      nav: 'absolute right-3 top-3 z-10 flex items-center gap-2',
                      button_previous: 'static h-9 w-9 rounded-full border border-border/70 bg-background text-foreground shadow-sm hover:bg-accent',
                      button_next: 'static h-9 w-9 rounded-full border border-border/70 bg-background text-foreground shadow-sm hover:bg-accent',
                      month_caption: 'mb-4 flex h-10 items-center justify-start rounded-2xl bg-muted/35 pl-4 pr-24 text-left',
                      caption_label: 'text-base font-semibold tracking-tight capitalize',
                      table: 'w-full border-collapse table-fixed',
                      weekdays: 'table-row',
                      weekday: 'pb-2 text-center text-[0.78rem] font-medium uppercase tracking-[0.12em] text-muted-foreground',
                      week: 'table-row',
                      day: 'p-0 text-center align-middle',
                      day_button: 'h-11 w-11 rounded-xl text-sm font-medium',
                      range_start: 'bg-primary/15 rounded-2xl',
                      range_middle: 'bg-primary/10',
                      range_end: 'bg-primary/15 rounded-2xl',
                      today: 'rounded-xl border border-primary/30 bg-primary/5 text-primary',
                      disabled: 'text-muted-foreground',
                      hidden: 'invisible',
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

            <DialogFooter className="mt-auto shrink-0 border-t border-border/70 bg-background/95 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:space-x-0">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResetModal}
                className="h-11 rounded-full px-5 text-muted-foreground"
              >
                {t('dateSelector.reset')}
              </Button>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
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
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <AlertDialogContent className="max-w-md rounded-[24px] border-border/80">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dateSelector.resetDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription className="leading-6">
              {t('dateSelector.resetWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooterActions>
            <AlertDialogCancel className="rounded-full">
              {t('dateSelector.resetDialogCancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmResetModal}
              className="rounded-full"
            >
              {t('dateSelector.resetDialogConfirm')}
            </AlertDialogAction>
          </AlertDialogFooterActions>
        </AlertDialogContent>
      </AlertDialog>
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
