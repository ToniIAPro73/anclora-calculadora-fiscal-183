import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { generateTaxReport } from '@/lib/generatePdf';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('taxnomad_session');
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setSession(data);
        // Auto-download the PDF
        downloadPdf(data);
        // Clean up session data after use
        sessionStorage.removeItem('taxnomad_session');
      } catch {
        setError(true);
      }
    } else {
      // Could be a real Stripe success redirect — session_id in URL
      const params = new URLSearchParams(window.location.search);
      if (!params.get('session_id')) setError(true);
    }
  }, []);

  const downloadPdf = (data) => {
    try {
      const doc = generateTaxReport({
        name: data.name,
        taxId: data.taxId,
        totalDays: data.totalDays,
        ranges: data.ranges || [],
        language: 'es',
      });
      const safeName = (data.name || 'informe').replace(/\s+/g, '_');
      doc.save(`TaxNomad_Informe_${safeName}_2026.pdf`);
      setDownloaded(true);
    } catch (err) {
      console.error('PDF generation error:', err);
    }
  };

  const handleDownloadAgain = () => {
    if (session) downloadPdf(session);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
        <Logo size={48} />
        <h1 className="text-2xl font-black text-foreground">Sesión expirada</h1>
        <p className="text-muted-foreground text-center max-w-sm">
          No se encontró una sesión de pago activa. Si ya pagaste, contacta con soporte.
        </p>
        <Button onClick={() => navigate('/')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al calculador
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">

        {/* Success icon */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div className="absolute -bottom-1 -right-1">
              <Logo size={28} />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              ¡Pago completado!
            </h1>
            <p className="text-muted-foreground mt-1">
              Tu informe fiscal está listo.
            </p>
          </div>
        </div>

        {/* Session summary */}
        {session && (
          <div className="rounded-2xl border border-border bg-muted/30 p-6 text-left space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <FileText className="w-4 h-4 text-primary" />
              Informe de Residencia Fiscal 2026
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Titular</span>
                <span className="font-semibold">{session.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Identificación</span>
                <span className="font-mono">{session.taxId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Días en España</span>
                <span className="font-bold text-primary">{session.totalDays} días</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado</span>
                <span className={`font-bold ${
                  session.totalDays > 183 ? 'text-red-500' :
                  session.totalDays > 150 ? 'text-orange-500' : 'text-green-600'
                }`}>
                  {session.totalDays > 183 ? 'Límite superado' :
                   session.totalDays > 150 ? 'Atención' : 'Seguro'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Download status */}
        {downloaded ? (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              PDF descargado automáticamente
            </div>
            <Button
              onClick={handleDownloadAgain}
              variant="outline"
              className="w-full rounded-full h-11 font-semibold gap-2"
            >
              <Download className="w-4 h-4" /> Descargar de nuevo
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleDownloadAgain}
            className="w-full rounded-full h-12 font-bold text-base gap-2 shadow-lg"
          >
            <Download className="w-4 h-4" /> Descargar informe PDF
          </Button>
        )}

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mx-auto transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al calculador
        </button>

        <p className="text-xs text-muted-foreground">
          Guarda este PDF en un lugar seguro. Es tu documento de respaldo fiscal.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
