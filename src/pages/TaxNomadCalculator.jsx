import React, { useState, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowSquareOut,
  CalendarPlus,
  CheckCircle,
  ClockCountdown,
  FilePdf,
  ShieldCheck,
  WarningCircle,
} from '@phosphor-icons/react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import DateRangeSelector from '@/components/DateRangeSelector.jsx';
import RangeList from '@/components/RangeList.jsx';
import ProgressBar from '@/components/ProgressBar.jsx';
import DataAuthoritySection from '@/components/DataAuthoritySection.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage.js';
import { mergeDateRanges, calculateUniqueDays } from '@/lib/dateRangeMerger.js';
import { buildExampleReportPayload } from '@/lib/reportMetadata.js';
import { getCanonicalUrl, getDefaultUrl } from '@/lib/seo.js';

const UserDetailsModal = lazy(() => import('@/components/UserDetailsModal.jsx'));

const TaxNomadCalculator = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [fiscalYear, setFiscalYear] = useState(() => new Date().getFullYear());
  const [selectedRanges, setSelectedRanges] = useState([]);
  const [editingRangeIndex, setEditingRangeIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', documentType: 'passport', taxId: '' });

  const { merged, annotatedRanges } = mergeDateRanges(selectedRanges);
  const totalDays = calculateUniqueDays(merged);
  const LIMIT = 183;
  const remaining = Math.max(LIMIT - totalDays, 0);
  const percentage = Math.min((totalDays / LIMIT) * 100, 100);
  const canonicalUrl = getCanonicalUrl(language);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: t('authority.whatIsTitle'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('authority.whatIsDesc'),
        },
      },
      {
        '@type': 'Question',
        name: t('authority.whatCountsTitle'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: [
            t('authority.whatCountsDesc'),
            t('authority.whatCountsList1'),
            t('authority.whatCountsList2'),
            t('authority.whatCountsList3'),
            t('authority.whatCountsList4'),
          ].join(' '),
        },
      },
      {
        '@type': 'Question',
        name: t('authority.exceptionsTitle'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: [
            t('authority.exceptionsDesc'),
            t('authority.exceptionsList1'),
            t('authority.exceptionsList2'),
            t('authority.exceptionsList3'),
            t('authority.exceptionsList4'),
            t('authority.exceptionsList5'),
          ].join(' '),
        },
      },
    ],
  };

  const statusObj = totalDays <= 150
    ? { color: 'safe',        label: t('progress.safe') }
    : totalDays <= 183
    ? { color: 'warning',     label: t('progress.approaching') }
    : { color: 'destructive', label: t('progress.over') };

  const handleAddRange = (range) => {
    setSelectedRanges(prev => [...prev, range]);
  };

  const handleRemoveRange = (index) => {
    setSelectedRanges(prev => prev.filter((_, i) => i !== index));
    setEditingRangeIndex((currentIndex) => {
      if (currentIndex === null) return null;
      if (currentIndex === index) return null;
      return currentIndex > index ? currentIndex - 1 : currentIndex;
    });
  };

  const handleEditRange = (index) => {
    setEditingRangeIndex(index);
    setIsRangeModalOpen(true);
  };

  const handleFiscalYearChange = (value) => {
    const nextYear = Number(value);
    if (nextYear === fiscalYear) return;
    setFiscalYear(nextYear);
    setSelectedRanges([]);
    setEditingRangeIndex(null);
  };

  const fiscalYearOptions = Array.from(
    { length: new Date().getFullYear() - 2015 + 1 },
    (_, i) => new Date().getFullYear() - i,
  );

  const handleUpdateRange = (index, nextRange) => {
    setSelectedRanges(prev => prev.map((range, currentIndex) => (
      currentIndex === index ? nextRange : range
    )));
    setEditingRangeIndex(null);
  };

  const handleOpenExample = async () => {
    const previewWindow = window.open('about:blank', '_blank');
    const example = buildExampleReportPayload();

    try {
      const { generateTaxReport } = await import('@/lib/generatePdf.js');
      const doc = await generateTaxReport({
        name: example.name,
        documentType: example.documentType,
        taxId: example.taxId,
        totalDays: example.totalDays,
        ranges: example.ranges,
        fiscalYear: example.fiscalYear,
        language,
        exampleMode: true,
      });

      const blobUrl = doc.output('bloburl');

      if (previewWindow && !previewWindow.closed) {
        previewWindow.opener = null;
        previewWindow.location.href = blobUrl;
      } else {
        window.open(blobUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      previewWindow?.close();
      toast.error('No se pudo generar el ejemplo del PDF.');
      console.error('Example PDF generation error:', error);
    }
  };

  const handleConfirmPurchase = async () => {
    setIsProcessing(true);

    // Persist session data so payment & success pages can access it
    const sessionData = {
      name: userData.name,
      email: userData.email,
      documentType: userData.documentType,
      taxId: userData.taxId,
      language,
      totalDays,
      statusLabel: statusObj.label,
      fiscalYear,
      ranges: selectedRanges.map(r => ({
        start: r.start instanceof Date ? r.start.toISOString() : r.start,
        end:   r.end   instanceof Date ? r.end.toISOString()   : r.end,
        days:  r.days,
      })),
      uniqueRanges: merged.map(r => ({
        start: r.start instanceof Date ? r.start.toISOString() : r.start,
        end:   r.end   instanceof Date ? r.end.toISOString()   : r.end,
        days:  r.days,
      })),
    };
    sessionStorage.setItem('taxnomad_session', JSON.stringify(sessionData));

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        userData.name,
          email:       userData.email,
          documentType: userData.documentType,
          taxId:       userData.taxId,
          language,
          totalDays,
          statusLabel: statusObj.label,
          fiscalYear,
          ranges: selectedRanges.map(r => ({
            start: r.start instanceof Date ? r.start.toISOString() : r.start,
            end:   r.end   instanceof Date ? r.end.toISOString()   : r.end,
            days:  r.days,
          })),
        }),
      });

      if (!res.ok) throw new Error('API error');

      const { url } = await res.json();

      setIsModalOpen(false);
      setIsProcessing(false);

      if (url.startsWith('http')) {
        window.location.href = url; // Real Stripe hosted page
      } else {
        navigate(url);              // Internal mock route
      }
    } catch (error) {
      setIsModalOpen(false);
      setIsProcessing(false);

      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        navigate('/payment-mock');
        return;
      }

      console.error('Checkout creation error:', error);
      toast.error(t('toast.checkoutUnavailable'));
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="es" href={getCanonicalUrl('es')} />
        <link rel="alternate" hrefLang="en" href={getCanonicalUrl('en')} />
        <link rel="alternate" hrefLang="x-default" href={getDefaultUrl()} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <DateRangeSelector
        fiscalYear={fiscalYear}
        ranges={selectedRanges}
        onAddRange={handleAddRange}
        onUpdateRange={handleUpdateRange}
        editingRangeIndex={editingRangeIndex}
        onEditingHandled={() => setEditingRangeIndex(null)}
        isOpen={isRangeModalOpen}
        setIsOpen={setIsRangeModalOpen}
      />

      <div className="relative flex min-h-[100dvh] flex-col bg-background pb-[calc(5.75rem+env(safe-area-inset-bottom))] lg:pb-0">
        <Header
          totalDays={totalDays}
          onOpenModal={() => setIsModalOpen(true)}
          onOpenExample={handleOpenExample}
        />

        <main className="flex-1">
          <section className="premium-section pb-6 pt-6 md:pt-10">
            <div className="grid items-start gap-6">
              <div className="space-y-6 animate-fade-in-up">
                <div className="trust-panel p-5 sm:p-7">
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-end">
                    <div className="space-y-4">
                      <span className="premium-eyebrow">
                        <ShieldCheck size={12} weight="fill" className="mr-2" />
                        {t('dashboard.eyebrow')}
                      </span>
                      <div className="max-w-3xl space-y-4">
                        <h1 className="text-4xl font-[700] tracking-tight text-foreground sm:text-5xl xl:text-6xl">
                          {t('header.title')}
                        </h1>
                        <p className="max-w-[68ch] text-base leading-7 text-muted-foreground sm:text-lg">
                          {t('dashboard.intro')}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/40 p-4">
                      <label htmlFor="fiscal-year" className="field-label">
                        {t('fiscalYear.label')}
                      </label>
                      <div className="mt-3 flex items-center gap-3">
                        <Select
                          value={String(fiscalYear)}
                          onValueChange={handleFiscalYearChange}
                        >
                          <SelectTrigger
                            id="fiscal-year"
                            className="h-11 w-36 rounded-md border-input bg-background text-base font-semibold text-foreground focus:ring-ring/35"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fiscalYearOptions.map((year) => (
                              <SelectItem key={year} value={String(year)}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs leading-5 text-muted-foreground">
                          {t('fiscalYear.helper')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: t('stats.totalDays'), value: `${totalDays}`, icon: ClockCountdown, helper: t('dashboard.totalHelper') },
                    { label: t('stats.remainingDays'), value: `${remaining}`, icon: ShieldCheck, helper: t('dashboard.remainingHelper') },
                    { label: t('stats.limitUsage'), value: `${percentage.toFixed(1)}%`, icon: ArrowSquareOut, helper: statusObj.label },
                  ].map(({ label, value, icon: Icon, helper }) => (
                    <div key={label} className="trust-panel reveal-surface p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <p className="field-label">{label}</p>
                          <p className="text-3xl font-[700] tracking-tight text-foreground">{value}</p>
                          <p className="text-xs text-muted-foreground">{helper}</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/15 bg-primary/10">
                          <Icon size={19} weight="bold" className="text-primary" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRangeIndex(null);
                        setIsRangeModalOpen(true);
                      }}
                      className="group flex w-full items-center justify-between gap-5 rounded-xl border border-dashed border-primary/35 bg-primary/[0.08] p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                          <CalendarPlus size={22} weight="bold" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-foreground">
                            {selectedRanges.length > 0 ? t('dateSelector.addAnotherRange') : t('dateSelector.title')}
                          </h2>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {t('dateSelector.description')}
                          </p>
                        </div>
                      </div>
                      <ArrowSquareOut size={18} weight="bold" className="hidden text-primary transition-transform duration-200 group-hover:translate-x-0.5 sm:block" />
                    </button>

                    <RangeList
                      ranges={annotatedRanges}
                      onRemoveRange={handleRemoveRange}
                      onEditRange={handleEditRange}
                    />

                    {selectedRanges.length === 0 && (
                      <div className="trust-panel p-5">
                        <div className="flex gap-3">
                          <WarningCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-[hsl(var(--warning))]" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{t('dashboard.emptyTitle')}</p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('dashboard.emptyDescription')}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <DataAuthoritySection />
                  </div>

                  <div className="space-y-4 xl:sticky xl:top-28">
                    <div className="trust-panel p-5">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="premium-eyebrow">{t('dashboard.statusEyebrow')}</span>
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                            statusObj.color === 'safe'
                              ? 'border-[hsl(var(--success)/0.22)] bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]'
                              : statusObj.color === 'warning'
                              ? 'border-[hsl(var(--warning)/0.28)] bg-[hsl(var(--warning)/0.13)] text-[hsl(var(--warning-foreground))]'
                              : 'border-[hsl(var(--destructive)/0.25)] bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--destructive))]'
                          }`}>
                            {statusObj.color === 'safe' ? <CheckCircle size={14} weight="fill" /> : <WarningCircle size={14} weight="fill" />}
                            {statusObj.label}
                          </span>
                        </div>

                        <div>
                          <p className="field-label">{t('progress.title')}</p>
                          <div className="mt-2 flex items-end gap-2">
                            <span className="text-5xl font-[750] tracking-tight text-foreground">{totalDays}</span>
                            <span className="pb-1 text-lg font-semibold text-muted-foreground">/ 183</span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('dashboard.statusDescription')}</p>
                        </div>

                        <ProgressBar totalDays={totalDays} />
                      </div>
                    </div>

                    <div className="trust-panel p-5">
                      <div className="flex items-start gap-3">
                        <FilePdf size={22} weight="bold" className="mt-0.5 shrink-0 text-primary" />
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-foreground">{t('pdfCard.title')}</h3>
                          <p className="text-sm leading-6 text-muted-foreground">{t('pdfCard.description')}</p>
                        </div>
                      </div>

                      <div className="mt-5 space-y-2 rounded-lg border border-border bg-muted/35 p-3 text-sm">
                        <div className="flex justify-between gap-3">
                          <span className="text-muted-foreground">{t('stats.totalDays')}</span>
                          <span className="font-semibold text-foreground">{totalDays}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-muted-foreground">{t('stats.status')}</span>
                          <span className="font-semibold text-foreground">{statusObj.label}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-muted-foreground">{t('pdfCard.price')}</span>
                          <span className="font-semibold text-foreground">9,99 €</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={totalDays <= 0}
                        onClick={() => setIsModalOpen(true)}
                        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                      >
                        <FilePdf size={18} weight="bold" />
                        {t('actions.generatePdf')} · 9,99 €
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenExample}
                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent"
                      >
                        <ArrowSquareOut size={16} weight="bold" />
                        {t('actions.viewExample')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />

        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/88 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-18px_45px_-30px_rgba(15,23,42,0.75)] backdrop-blur-xl lg:hidden">
          <div className="mx-auto grid max-w-md grid-cols-[0.82fr_1.18fr] gap-2 rounded-xl border border-border/80 bg-card/90 p-2">
            <button
              type="button"
              onClick={handleOpenExample}
              className="inline-flex h-12 min-w-0 items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <ArrowSquareOut size={17} weight="bold" className="shrink-0 text-primary" />
              <span className="truncate">{t('actions.viewExample')}</span>
            </button>
            <button
              type="button"
              disabled={totalDays <= 0}
              onClick={() => setIsModalOpen(true)}
              className="inline-flex h-12 min-w-0 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
            >
              <FilePdf size={18} weight="bold" className="shrink-0" />
              <span className="truncate">{t('actions.generatePdf')} · 9,99 €</span>
            </button>
          </div>
        </div>

        <Suspense fallback={null}>
          <UserDetailsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmPurchase}
            userData={userData}
            setUserData={setUserData}
            isLoading={isProcessing}
          />
        </Suspense>
      </div>
    </>
  );
};

export default TaxNomadCalculator;
