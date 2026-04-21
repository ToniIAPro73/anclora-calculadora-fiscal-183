import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowSquareOut,
  CalendarPlus,
  ClockCountdown,
  ShieldCheck,
  Sparkle,
} from '@phosphor-icons/react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import DateRangeSelector from '@/components/DateRangeSelector.jsx';
import RangeList from '@/components/RangeList.jsx';
import ProgressBar from '@/components/ProgressBar.jsx';
import SummaryCard from '@/components/SummaryCard.jsx';
import DataAuthoritySection from '@/components/DataAuthoritySection.jsx';
import UserDetailsModal from '@/components/UserDetailsModal.jsx';
import { useLanguage } from '@/hooks/useLanguage.js';
import { mergeDateRanges, calculateUniqueDays } from '@/lib/dateRangeMerger.js';
import { buildExampleReportPayload } from '@/lib/reportMetadata.js';
import { generateTaxReport } from '@/lib/generatePdf.js';

const TaxNomadCalculator = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedRanges, setSelectedRanges] = useState([]);
  const [editingRangeIndex, setEditingRangeIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userData, setUserData] = useState({ name: '', documentType: 'passport', taxId: '' });

  const { merged, annotatedRanges } = mergeDateRanges(selectedRanges);
  const totalDays = calculateUniqueDays(merged);
  const LIMIT = 183;
  const remaining = Math.max(LIMIT - totalDays, 0);
  const percentage = Math.min((totalDays / LIMIT) * 100, 100);

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
      const doc = await generateTaxReport({
        name: example.name,
        documentType: example.documentType,
        taxId: example.taxId,
        totalDays: example.totalDays,
        ranges: example.ranges,
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
      documentType: userData.documentType,
      taxId: userData.taxId,
      totalDays,
      statusLabel: statusObj.label,
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
          documentType: userData.documentType,
          taxId:       userData.taxId,
          totalDays,
          statusLabel: statusObj.label,
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
    } catch {
      // Dev fallback: no Vercel function running locally
      setIsModalOpen(false);
      setIsProcessing(false);
      navigate('/payment-mock');
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('meta.title')}</title>
      </Helmet>

      <DateRangeSelector
        ranges={selectedRanges}
        onAddRange={handleAddRange}
        onUpdateRange={handleUpdateRange}
        editingRangeIndex={editingRangeIndex}
        onEditingHandled={() => setEditingRangeIndex(null)}
        isOpen={isRangeModalOpen}
        setIsOpen={setIsRangeModalOpen}
      />

      <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-background">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="glass-orb left-[-10rem] top-[-6rem] h-[22rem] w-[22rem] bg-cyan-500/20" />
          <div className="glass-orb right-[-8rem] top-[8rem] h-[24rem] w-[24rem] bg-blue-500/15" />
          <div className="glass-orb bottom-[-10rem] left-[24%] h-[20rem] w-[20rem] bg-emerald-400/10" />
          <div className="page-noise absolute inset-0 opacity-[0.08]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_30%),linear-gradient(180deg,transparent,rgba(2,6,23,0.08))]" />
        </div>

        <Header
          totalDays={totalDays}
          onOpenModal={() => setIsModalOpen(true)}
          onOpenExample={handleOpenExample}
        />

        <main className="flex-1">
          <section className="premium-section pb-12 pt-8 md:pt-14">
            <div className="grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr]">
              <motion.div
                initial={{ opacity: 0, y: 42, filter: 'blur(16px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
                className="space-y-8"
              >
                <div className="space-y-5">
                  <span className="premium-eyebrow">
                    <Sparkle size={12} weight="fill" className="mr-2" />
                    Audit-ready residency intelligence
                  </span>
                  <div className="max-w-4xl space-y-5">
                    <h1 className="text-5xl font-[650] tracking-[-0.06em] text-foreground sm:text-6xl xl:text-7xl">
                      {t('header.title')}
                    </h1>
                    <p className="max-w-[62ch] text-base leading-8 text-muted-foreground sm:text-lg">
                      {t('header.subtitle')}. Controla tus periodos en Espana o la UE, anticipa el umbral fiscal
                      y genera una salida documental pensada para auditoria, compliance y toma de decisiones.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: t('stats.totalDays'), value: `${totalDays}`, icon: ClockCountdown },
                    { label: t('stats.remainingDays'), value: `${remaining}`, icon: ShieldCheck },
                    { label: t('stats.limitUsage'), value: `${percentage.toFixed(1)}%`, icon: ArrowSquareOut },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="double-shell reveal-surface">
                      <div className="double-shell-core p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
                            <p className="text-3xl font-[620] tracking-[-0.05em] text-foreground">{value}</p>
                          </div>
                          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                            <Icon size={20} weight="light" className="text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="double-shell reveal-surface">
                  <div className="double-shell-core grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                      <span className="premium-eyebrow">Operational workflow</span>
                      <h2 className="text-2xl font-[620] tracking-[-0.05em] text-foreground sm:text-3xl">
                        La utilidad pasa de ser una calculadora funcional a sentirse como una herramienta fiscal premium.
                      </h2>
                      <p className="max-w-[58ch] text-sm leading-7 text-muted-foreground sm:text-base">
                        Cada rango, cada dia consumido y cada documento exportado se presenta con jerarquia clara,
                        superficies mas precisas y una lectura orientada a confianza.
                      </p>
                    </div>
                    <div className="grid gap-4">
                      {[
                        'Seguimiento por rangos sincronizado con calendario',
                        'Lectura inmediata del riesgo frente al limite de 183 dias',
                        'PDF final listo para documentacion y revision',
                      ].map((item) => (
                        <div key={item} className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-foreground/90">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 42, filter: 'blur(16px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.95, delay: 0.08, ease: [0.32, 0.72, 0, 1] }}
                className="double-shell lg:sticky lg:top-28"
              >
                <div className="double-shell-core space-y-6 p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="premium-eyebrow">Live overview</span>
                    <button
                      type="button"
                      onClick={handleOpenExample}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-[1px] hover:text-foreground"
                    >
                      <ArrowSquareOut size={14} weight="bold" />
                      {t('actions.viewExample')}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Residency pulse</p>
                    <h2 className="text-4xl font-[650] tracking-[-0.06em] text-foreground">
                      {totalDays} <span className="text-muted-foreground">/ 183</span>
                    </h2>
                    <p className="max-w-[42ch] text-sm leading-7 text-muted-foreground">
                      Tu situacion actual se recalcula en tiempo real segun los rangos consolidados y el estado del umbral fiscal.
                    </p>
                  </div>

                  <ProgressBar totalDays={totalDays} />

                  <div className="grid gap-4">
                    <SummaryCard title={t('stats.totalDays')} value={totalDays} status={statusObj} />
                    <SummaryCard title={t('stats.remainingDays')} value={remaining} status={statusObj} />
                    <SummaryCard title={t('stats.limitUsage')} value={`${percentage.toFixed(1)}%`} status={statusObj} />
                  </div>

                  <div className="rounded-[1.75rem] border border-primary/15 bg-[linear-gradient(180deg,rgba(56,189,248,0.12),rgba(56,189,248,0.03))] p-5">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                        <ShieldCheck size={20} weight="light" className="text-primary" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/85">
                          {t('auditReady.title')}
                        </p>
                        <p className="text-sm leading-7 text-muted-foreground">
                          {t('auditReady.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="premium-section pt-0">
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.08fr)_380px]">
              <div className="space-y-8">
                <div className="space-y-6">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRangeIndex(null);
                      setIsRangeModalOpen(true);
                    }}
                    className="group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-[#0d1320] p-8 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-primary/30 hover:bg-[#0f172a] sm:p-12"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                    
                    <div className="relative flex flex-col items-center gap-6">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110">
                        <CalendarPlus size={32} weight="fill" className="text-primary" />
                      </div>
                      
                      <div className="space-y-2 text-center">
                        <h3 className="text-3xl font-[700] tracking-tight text-white">
                          {selectedRanges.length > 0 ? t('dateSelector.addAnotherRange') : t('dateSelector.title')}
                        </h3>
                        <p className="max-w-[40ch] text-base leading-relaxed text-muted-foreground">
                          {t('dateSelector.description')}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 rounded-full bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors duration-700 group-hover:bg-primary group-hover:text-primary-foreground">
                        <CalendarPlus size={20} weight="bold" />
                        {selectedRanges.length > 0 ? t('dateSelector.addAnotherRange') : t('dateSelector.title')}
                      </div>
                    </div>
                  </button>

                  <RangeList
                    ranges={annotatedRanges}
                    onRemoveRange={handleRemoveRange}
                    onEditRange={handleEditRange}
                  />
                </div>
                <DataAuthoritySection />
              </div>

              <div className="double-shell lg:sticky lg:top-28">
                <div className="double-shell-core space-y-5 p-6">
                  <span className="premium-eyebrow">Conversion layer</span>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-[620] tracking-[-0.05em] text-foreground">
                      Exporta el informe cuando tu rango ya este listo.
                    </h3>
                    <p className="text-sm leading-7 text-muted-foreground">
                      El checkout y el PDF final quedan en una misma narrativa de producto: control, trazabilidad y salida documental.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={totalDays <= 0}
                    onClick={() => setIsModalOpen(true)}
                    className="group inline-flex w-full items-center justify-between rounded-full border border-primary/20 bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                  >
                    <span>{t('actions.generatePdf')} · 9,99 €</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/15 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                      <ArrowSquareOut size={18} weight="bold" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />

        <UserDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmPurchase}
          userData={userData}
          setUserData={setUserData}
          isLoading={isProcessing}
        />
      </div>
    </>
  );
};

export default TaxNomadCalculator;
