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
  startOfDay,
  isSameDay,
} from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import {
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
  const today = useMemo(() => startOfDay(new Date()), []);
  const initialMonth = useMemo(() => startOfMonth(today), [today]);
  const exerciseStart = useMemo(() => startOfYear(today), []);
  const exerciseEnd = useMemo(() => endOfYear(today), []);
  
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

  // Sincronización al entrar en modo edición
  useEffect(() => {
    if (isOpen && currentEditingRange) {
      const s = startOfDay(new Date(currentEditingRange.start));
      const e = startOfDay(new Date(currentEditingRange.end));
      setDraftStart(s);
      setDraftEnd(e);
      setStartInput(toInputValue(s));
      setEndInput(toInputValue(e));
      setHoverDate(null);
      setVisibleMonth(startOfMonth(s));
    }
  }, [isOpen, currentEditingRange]);

  const occupiedRanges = useMemo(
    () => ranges.filter((_, index) => index !== editingRangeIndex),
    [editingRangeIndex, ranges],
  );

  const occupiedDayKeys = useMemo(() => {
    const keys = new Set();
    occupiedRanges.forEach((range) => {
      try {
        eachDayOfInterval({ 
          start: startOfDay(new Date(range.start)), 
          end: startOfDay(new Date(range.end)) 
        }).forEach((day) => {
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
    
    // Prioridad 1: Rango completo (Inicio + Fin)
    if (draftEnd) {
      return { from: draftStart, to: draftEnd };
    }

    // Prioridad 2: Preview con Hover
    if (hoverDate) {
      const [from, to] = isAfter(draftStart, hoverDate) ? [hoverDate, draftStart] : [draftStart, hoverDate];
      return { from, to };
    }

    // Prioridad 3: Solo inicio
    return { from: draftStart, to: draftStart };
  }, [draftEnd, draftStart, hoverDate]);

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

  const handleDayClick = (day) => {
    const clickedDay = startOfDay(day);
    if (isDayDisabled(clickedDay)) return;

    if (!draftStart || draftEnd) {
      setDraftStart(clickedDay);
      setDraftEnd(null);
      setStartInput(toInputValue(clickedDay));
      setEndInput('');
      setHoverDate(null);
      return;
    }

    const [nextStart, nextEnd] = isAfter(draftStart, clickedDay) 
      ? [clickedDay, draftStart] 
      : [draftStart, clickedDay];
    
    if (rangeContainsOccupiedDays(nextStart, nextEnd, occupiedDayKeys)) {
      setDraftStart(clickedDay);
      setDraftEnd(null);
      setStartInput(toInputValue(clickedDay));
      setEndInput('');
    } else {
      setDraftStart(nextStart);
      setDraftEnd(nextEnd);
      setStartInput(toInputValue(nextStart));
      setEndInput(toInputValue(nextEnd));
    }
    setHoverDate(null);
  };

  const handleStartInputChange = (value) => {
    setStartInput(value);
    const parsedDate = parseInputDate(value);
    if (parsedDate && !isOutsideExercise(parsedDate, exerciseStart, exerciseEnd)) {
      const d = startOfDay(parsedDate);
      setDraftStart(d);
      setVisibleMonth(startOfMonth(d));
      if (draftEnd && isBefore(draftEnd, d)) {
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
      const d = startOfDay(parsedDate);
      setDraftEnd(d);
      setVisibleMonth(startOfMonth(d));
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
    const d = startOfDay(date);
    if (isOutsideExercise(d, exerciseStart, exerciseEnd)) return true;
    if (occupiedDayKeys.has(toDayKey(d))) return true;
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
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
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

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-3 sm:px-6">
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-widest text-white/50">
                  <div className="h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20" />
                  {t('dateSelector.activeRange')}
                </div>
                <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-widest text-white/50">
                  <div className="flex h-3 w-3 items-center justify-center rounded-full bg-white/10 ring-4 ring-white/5">
                    <div className="h-1.5 w-[1px] rotate-45 bg-white/40" />
                    <div className="h-1.5 w-[1px] -rotate-45 bg-white/40" />
                  </div>
                  {t('dateSelector.usedDates')}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeModal}
                  className="ml-2 h-8 w-8 rounded-full bg-white/5 hover:bg-white/10"
                >
                  <X size={16} weight="bold" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
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
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden bg-[#090e1a]">
              <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 sm:px-8">
                <div className="flex gap-4">
                  {visibleMonths.map((m, i) => (
                    <span key={i} className="text-sm font-bold text-white sm:text-base">
                      {format(m, 'MMMM yyyy', { locale })}
                      {i === 0 && monthCount > 1 && <span className="mx-2 opacity-20">/</span>}
                    </span>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVisibleMonth(initialMonth)}
                  className="h-9 rounded-full border-white/10 bg-white/5 px-4 text-xs font-bold uppercase tracking-widest sm:flex"
                >
                  {premiumCopy.jumpToToday}
                </Button>
              </div>

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
                  onDayMouseEnter={(day) => selectingEnd && setHoverDate(startOfDay(day))}
                  disabled={isDayDisabled}
                  startMonth={exerciseStart}
                  endMonth={exerciseEnd}
                  showOutsideDays={false}
                  className="mx-auto"
                  modifiers={{
                    occupied: (date) => occupiedDayKeys.has(toDayKey(date)),
                  }}
                  modifiersClassNames={{
                    occupied: 'occupied-day opacity-100 grayscale-0 pointer-events-none',
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
                    range_start: "bg-primary text-primary-foreground rounded-xl !opacity-100 ring-4 ring-primary/30 z-10",
                    range_end: "bg-primary text-primary-foreground rounded-xl !opacity-100 ring-4 ring-primary/30 z-10",
                    range_middle: "bg-primary/20 text-primary !rounded-none opacity-100",
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

          <DialogFooter className="shrink-0 border-t border-white/5 bg-[#0b1222] px-6 py-4 sm:px-8 sm:py-6 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                resetDraft();
                setResetConfirmOpen(false);
              }}
              className="h-11 rounded-full px-6 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/5"
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

      <style dangerouslySetInnerHTML={{ __html: `
        .occupied-day button {
          background: rgba(255, 255, 255, 0.05) !important;
          color: rgba(255, 255, 255, 0.35) !important;
          text-decoration: line-through;
          cursor: not-allowed !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
      `}} />
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

function isOutsideExercise(date, exerciseStart, exerciseEnd) {
  return isBefore(date, exerciseStart) || isAfter(date, exerciseEnd);
}

function rangeContainsOccupiedDays(start, end, occupiedDayKeys) {
  if (!start || !end) return false;
  try {
    const s = startOfDay(new Date(start));
    const e = startOfDay(new Date(end));
    const [safeStart, safeEnd] = isAfter(s, e) ? [e, s] : [s, e];
    return eachDayOfInterval({ start: safeStart, end: safeEnd }).some((day) =>
      occupiedDayKeys.has(toDayKey(day)),
    );
  } catch (e) {
    return false;
  }
}

export default DateRangeSelector;
