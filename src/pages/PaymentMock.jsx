import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, FileText, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

const PaymentMock = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('taxnomad_session');
    if (raw) {
      try { setSession(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const handlePay = () => {
    setPaying(true);
    // Simulate a brief network delay, then redirect to success
    setTimeout(() => navigate('/payment-success'), 1200);
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] flex flex-col">
      {/* Test mode banner */}
      <div className="bg-amber-400 text-amber-900 text-center text-sm font-semibold py-2 flex items-center justify-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        MODO DE PRUEBA — No se realizará ningún cargo real
      </div>

      <div className="flex-1 flex items-start justify-center pt-12 px-4">
        <div className="w-full max-w-3xl flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-200">

          {/* Left: Product summary */}
          <div className="md:w-5/12 bg-[#1a1f2e] text-white p-8 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Logo size={36} />
              <div>
                <p className="font-black text-lg leading-tight">TaxNomad</p>
                <p className="text-blue-300 text-xs">Informe de Residencia Fiscal</p>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Total a pagar</p>
              <p className="text-4xl font-black">9,99 €</p>
              <p className="text-gray-400 text-xs mt-1">IVA incluido</p>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Informe PDF Premium</p>
                  <p className="text-xs text-gray-400">Regla de los 183 días · 2026</p>
                </div>
              </div>
              {session && (
                <>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="w-4 text-center">·</span>
                    Nombre: <span className="text-white">{session.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="w-4 text-center">·</span>
                    Días calculados: <span className="text-white font-bold">{session.totalDays}</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-auto flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              Powered by <span className="font-semibold text-gray-400">Stripe</span>
            </div>
          </div>

          {/* Right: Payment form (mock) */}
          <div className="md:w-7/12 p-8 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Pago con tarjeta</h2>
              <p className="text-gray-500 text-sm mt-1">
                Simulación de pago — ningún dato es real.
              </p>
            </div>

            {/* Mock card fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Número de tarjeta
                </label>
                <div className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-400 font-mono text-sm flex justify-between items-center">
                  <span>4242 4242 4242 4242</span>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-sans font-semibold">TEST</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Caducidad
                  </label>
                  <div className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-400 text-sm">
                    12 / 28
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    CVC
                  </label>
                  <div className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-400 text-sm">
                    •••
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Nombre en la tarjeta
                </label>
                <div className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-400 text-sm">
                  {session?.name || 'NOMBRE APELLIDOS'}
                </div>
              </div>
            </div>

            {/* Pay button */}
            <Button
              onClick={handlePay}
              disabled={paying}
              className="w-full h-12 rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              {paying ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Procesando…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Pagar 9,99 €
                </span>
              )}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <Lock className="w-3 h-3" />
              Pago seguro cifrado con SSL · Stripe
            </div>

            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mx-auto transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Volver al calculador
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 py-6">
        TaxNomad · Calculadora de Residencia Fiscal 2026
      </p>
    </div>
  );
};

export default PaymentMock;
