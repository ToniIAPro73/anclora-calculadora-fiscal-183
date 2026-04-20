import React, { useEffect, useMemo, useState } from 'react';
import {
  addMonths,
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
  subMonths,
} from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDots,
  CheckCircle,
  CornersOut,
  X,
  CalendarBlank,
  CalendarCheck,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  isOpen,
  setIsOpen,
}) => {
  const { t, language } = useLanguage();
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
  
  const premiumCopy = useMemo(() => (
    language === 'es'
      ? {
          rangeDrafting: 'Borrador del rango',
          calendarNavigation: 'Navegación mensual',
          calendarLead: 'Mueve el calendario sin perder el rango que estás preparando.',
          jumpToToday: 'Hoy',
          previousMonth: 'Anterior',
          nextMonth: 'Siguiente',
        }
      : {
          rangeDrafting: 'Range drafting',
          calendarNavigation: 'Monthly navigation',
          calendarLead: 'Move across months without losing the range you are drafting.',
          jumpToToday: 'Today',
          previousMonth: 'Previous',
          nextMonth: 'Next',
        }
  ), [language]);

  const isEditing = editingRangeIndex !== null && editingRangeIndex !== undefined;
  const currentEditingRange = isEditing ? ranges[editingRangeIndex] : null;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const syncMonths = () => setMonthCount(mediaQuery.matches ? 2 : 1);

    syncMonths();
    mediaQuery.addEventListener('change', syncMonths);

    return () => mediaQuery.removeEventListener('change', syncMonths);
  }, []);

  useEffect(() => {
    if (!isEditing || !isOpen) return;

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
  }, [currentEditingRange, isEditing, isOpen, onEditingHandled]);

  const occupiedRanges = useMemo(
    () => ranges.filter((_, index) => index !== editingRangeIndex),
    [editingRangeIndex, ranges],
  );

  const occupiedDayKeys = useMemo(() => {
    const keys = new Set();
    occupiedRanges.forEach((range) => {
      try {
        eachDayOfInterval({ start: range.start, end: range.end }).forEach((day) => {
          keys.add(toDayKey(day));
        });
      } catch (e) {
        console.error("Invalid range in occupiedDayKeys:", range, e);
      }
    });
    return keys;
  }, [occupiedRanges]);

  const validationMessage = useMemo(() => {
    if (!draftStart && !draftEnd && !startInput && !endInput) return null;

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
  const previousMonthDisabled = visibleMonth <= startOfMonth(exerciseStart);
  const nextMonthDisabled = addMonths(visibleMonth, monthCount - 1) >= startOfMonth(exerciseEnd);
  const visibleMonths = Array.from({ length: monthCount }, (_, index) => addMonths(visibleMonth, index));

  const resetDraft = () => {
    setDraftStart(null);
    setDraftEnd(null);
    setStartInput('');
    setEndInput('');
    setHoverDate(null);
    setVisibleMonth(initialMonth);
  };

  const closeModal = () => {
    setIsOpen(false);
    setResetConfirmOpen(false);
    resetDraft();
    onEditingHandled?.();
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

    const [nextStart, nextEnd] = normalizeBounds(draftStart, day);
    
    // Check if the range built by swapping contains occupied days
    if (rangeContainsOccupiedDays(nextStart, nextEnd, occupiedDayKeys)) {
      // If click was before start and swap causes overlap, we just start fresh with the new day
      syncDraftDates(day, null);
    } else {
      syncDraftDates(nextStart, nextEnd);
    }
    setHoverDate(null);
  };

  const handleStartInputChange = (value) => {
    setStartInput(value);
    const parsedDate = parseInputDate(value);
    if (parsedDate && !isOutsideExercise(parsedDate, exerciseStart, exerciseEnd)) {
      setDraftStart(parsedDate);
      setVisibleMonth(startOfMonth(parsedDate));
      if (draftEnd && isBefore(draftEnd, parsedDate)) {
        setDraftEnd(null);
        setEndInput('');
      }
    } else {
      setDraftStart(null);
    }
  };

  const handleEndInputChange = (value) => {
    setEndInput(value);
    const parsedDate = parseInputDate(value);
    if (parsedDate && !isOutsideExercise(parsedDate, exerciseStart, exerciseEnd)) {
      setDraftEnd(parsedDate);
      setVisibleMonth(startOfMonth(parsedDate));
    } else {
      setDraftEnd(null);
    }
  };

  const handleConfirm = () => {
    if (!canSubmit) return;
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
    return false;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(nextOpen) => (!nextOpen && closeModal())}>
        <DialogContent
          showClose={false}
          className="flex h-[100dvh] max-h-[100dvh] w-screen max-w-none flex-col gap-0 overflow-hidden border-none bg-[#090e1a] p-0 shadow-2xl sm:h-[92vh] sm:max-h-[850px] sm:w-[94vw] sm:max-w-[1200px] sm:rounded-[40px] sm:border sm:border-white/10"
        >
          {/* Header */}
          <DialogHeader className="shrink-0 border-b border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent px-6 py-5 sm:px-8 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1 text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                  <CalendarDots size={14} weight="fill" />
                  {isEditing ? t('dateSelector.editRange') : t('dateSelector.modalTitle')}
                </div>
                <DialogTitle className="text-2xl font-[700] tracking-tight text-white sm:text-3xl">
                  {isEditing ? t('dateSelector.editRange') : t('dateSelector.modalTitle')}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground sm:text-base">
                  {t('dateSelector.modalDescription')}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10"
              >
                <X size={20} weight="bold" />
              </Button>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
            {/* Left Column: Inputs & Info */}
            <div className="w-full border-b border-white/5 bg-[#0b1222]/50 p-6 sm:p-8 lg:w-[340px] lg:border-b-0 lg:border-r">
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {t('dateSelector.startDate')}
                    </label>
                    <div className="relative">
                      <Input
                        value={startInput}
                        onChange={(e) => handleStartInputChange(e.target.value)}
                        placeholder="YYYY/MM/DD"
                        className="h-12 border-white/10 bg-white/5 pl-10 text-base focus:ring-primary/20"
                      />
                      <CalendarBlank className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {t('dateSelector.endDate')}
                    </label>
                    <div className="relative">
                      <Input
                        value={endInput}
                        onChange={(e) => handleEndInputChange(e.target.value)}
                        placeholder="YYYY/MM/DD"
                        className="h-12 border-white/10 bg-white/5 pl-10 text-base focus:ring-primary/20"
                      />
                      <CalendarCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    </div>
                  </div>
                </div>

                <div className={cn(
                  "rounded-2xl border p-4 transition-all duration-300",
                  validationMessage 
                    ? "border-destructive/20 bg-destructive/10 text-destructive"
                    : "border-white/5 bg-white/[0.02] text-muted-foreground"
                )}>
                  <p className="text-sm leading-relaxed">
                    {validationMessage || (selectingEnd ? t('dateSelector.helperEnd') : t('dateSelector.helperStart'))}
                  </p>
                  {!validationMessage && draftStart && draftEnd && (
                    <div className="mt-4 space-y-2 pt-4 border-t border-white/5">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/40">{t('dateSelector.selectedRange')}</p>
                      <p className="text-lg font-bold text-white">
                        {differenceInCalendarDays(draftEnd, draftStart) + 1} {differenceInCalendarDays(draftEnd, draftStart) + 1 === 1 ? t('dateSelector.day') : t('dateSelector.days')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="hidden lg:block space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Leyenda</h4>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="h-4 w-4 rounded-full bg-primary" />
                      {t('dateSelector.activeRange')}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="h-4 w-4 rounded-full bg-white/10 border border-white/10" />
                      {t('dateSelector.usedDates')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Calendar */}
            <div className="flex flex-1 flex-col overflow-hidden bg-[#090e1a]">
              {/* Calendar Header / Nav */}
              <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 sm:px-8">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVisibleMonth(subMonths(visibleMonth, 1))}
                    disabled={previousMonthDisabled}
                    className="h-9 w-9 rounded-full p-0"
                  >
                    <ArrowLeft size={18} weight="bold" />
                  </Button>
                  <div className="flex gap-2">
                    {visibleMonths.map((m, i) => (
                      <span key={i} className="text-sm font-bold text-white sm:text-base">
                        {format(m, 'MMMM yyyy', { locale })}
                        {i === 0 && monthCount > 1 && <span className="mx-2 opacity-20">/</span>}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}
                    disabled={nextMonthDisabled}
                    className="h-9 w-9 rounded-full p-0"
                  >
                    <ArrowRight size={18} weight="bold" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVisibleMonth(initialMonth)}
                  className="hidden h-9 rounded-full border-white/10 bg-white/5 px-4 text-xs font-bold uppercase tracking-widest sm:flex"
                >
                  {premiumCopy.jumpToToday}
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <Calendar
                  mode="range"
                  locale={locale}
                  selected={rangePreview}
                  numberOfMonths={monthCount}
                  month={visibleMonth}
                  onMonthChange={setVisibleMonth}
                  weekStartsOn={language === 'es' ? 1 : 0}
                  onDayClick={handleDayClick}
                  onDayMouseEnter={(day) => selectingEnd && setHoverDate(day)}
                  disabled={isDayDisabled}
                  startMonth={exerciseStart}
                  endMonth={exerciseEnd}
                  showOutsideDays={false}
                  className="mx-auto"
                  modifiers={{
                    occupied: (date) => occupiedDayKeys.has(toDayKey(date)),
                  }}
                  modifiersClassNames={{
                    occupied: 'opacity-40 cursor-not-allowed grayscale pointer-events-none',
                  }}
                  classNames={{
                    root: "w-full",
                    months: "flex flex-col sm:flex-row gap-8 sm:gap-12 justify-center",
                    month: "space-y-6 w-full max-w-[320px]",
                    month_caption: "hidden",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex mb-2",
                    head_cell: "text-muted-foreground rounded-md w-full font-bold text-[10px] uppercase tracking-widest",
                    row: "flex w-full mt-1",
                    cell: cn(
                      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-full aspect-square",
                      "first:[&:has([data-selected])]:rounded-l-md last:[&:has([data-selected])]:rounded-r-md"
                    ),
                    day: cn(
                      "h-full w-full p-0 font-medium transition-all duration-200 rounded-xl flex items-center justify-center hover:bg-white/10 hover:text-white"
                    ),
                    range_start: "bg-primary text-primary-foreground rounded-xl !opacity-100",
                    range_end: "bg-primary text-primary-foreground rounded-xl !opacity-100",
                    range_middle: "bg-primary/20 text-primary !rounded-none",
                    selected: "opacity-100",
                    today: "bg-white/5 text-primary border border-primary/20 font-bold",
                    outside: "text-muted-foreground/30 opacity-50",
                    disabled: "text-muted-foreground/20",
                    hidden: "invisible",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="shrink-0 border-t border-white/5 bg-[#0b1222] px-6 py-4 sm:px-8 sm:py-6 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="ghost"
              onClick={() => setResetConfirmOpen(true)}
              className="hidden h-11 rounded-full px-6 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/5 sm:flex"
            >
              <CornersOut className="mr-2" size={18} />
              {t('dateSelector.reset')}
            </Button>

            <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">
              <Button
                variant="outline"
                onClick={closeModal}
                className="h-12 rounded-full border-white/10 bg-transparent px-8 text-sm font-bold uppercase tracking-widest"
              >
                {t('dateSelector.cancel')}
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!canSubmit}
                className="h-12 rounded-full bg-primary px-8 text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <CheckCircle className="mr-2" size={20} weight="bold" />
                {isEditing ? t('dateSelector.confirmEdit') : t('dateSelector.addRange')}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <AlertDialogContent className="max-w-md rounded-[32px] border-white/10 bg-[#0d1320] shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-white">{t('dateSelector.resetDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {t('dateSelector.resetWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooterActions className="mt-6 flex gap-3">
            <AlertDialogCancel className="h-11 flex-1 rounded-full border-white/10 bg-transparent">
              {t('dateSelector.resetDialogCancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetDraft();
                setResetConfirmOpen(false);
              }}
              className="h-11 flex-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
  return date ? format(date, 'yyyy/MM/dd') : '';
}

function parseInputDate(value) {
  if (!value) return null;
  const normalizedValue = value.replace(/\./g, '/').replace(/-/g, '/');
  const isoLikeValue = normalizedValue.replace(/\//g, '-');
  const parsedDate = parseISO(isoLikeValue);
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
