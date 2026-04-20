import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
import { Shield } from 'lucide-react';

const TaxNomadCalculator = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedRanges, setSelectedRanges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userData, setUserData] = useState({ name: '', taxId: '' });

  const { merged } = mergeDateRanges(selectedRanges);
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
    toast.success(t('toast.rangeAdded'));
  };

  const handleRemoveRange = (index) => {
    setSelectedRanges(prev => prev.filter((_, i) => i !== index));
    toast.success(t('toast.rangeRemoved'));
  };

  const handleConfirmPurchase = async () => {
    setIsProcessing(true);

    // Persist session data so payment & success pages can access it
    const sessionData = {
      name: userData.name,
      taxId: userData.taxId,
      totalDays,
      statusLabel: statusObj.label,
      ranges: merged.map(r => ({
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
          taxId:       userData.taxId,
          totalDays,
          statusLabel: statusObj.label,
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

      <div className="min-h-screen bg-background flex flex-col">
        <Header totalDays={totalDays} onOpenModal={() => setIsModalOpen(true)} />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tight">{t('header.title')}</h2>
                <p className="text-muted-foreground text-lg">{t('header.subtitle')}</p>
              </div>

              <DateRangeSelector onAddRange={handleAddRange} />
              <RangeList ranges={selectedRanges} onRemoveRange={handleRemoveRange} />
              <ProgressBar totalDays={totalDays} />
              <DataAuthoritySection />
            </div>

            <div className="w-full lg:w-80 shrink-0 space-y-6">
              <SummaryCard title={t('stats.totalDays')}     value={totalDays}                    status={statusObj} />
              <SummaryCard title={t('stats.remainingDays')} value={remaining}                    status={statusObj} />
              <SummaryCard title={t('stats.limitUsage')}    value={`${percentage.toFixed(1)}%`}  status={statusObj} />

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-[11px] text-muted-foreground flex gap-3">
                <Shield className="w-4 h-4 text-primary shrink-0" />
                <p><strong>Audit-Ready:</strong> Reporte generado bajo estándares de cumplimiento de la UE.</p>
              </div>
            </div>
          </div>
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
