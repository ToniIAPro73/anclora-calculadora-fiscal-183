import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop';
import TaxNomadCalculator from './pages/TaxNomadCalculator';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nProvider } from './contexts/i18nContext';
import { SeoAppSchema } from '@/components/SeoAppSchema';
import { getLanguageFromPath } from '@/lib/seo.js';

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PaymentMock = lazy(() => import('./pages/PaymentMock'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));

function AppShell() {
  const location = useLocation();
  const initialLanguage = getLanguageFromPath(location.pathname);

  return (
    <I18nProvider initialLanguage={initialLanguage}>
      <SeoAppSchema />
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<TaxNomadCalculator />} />
          <Route path="/calculator" element={<TaxNomadCalculator />} />
          <Route path="/es" element={<TaxNomadCalculator />} />
          <Route path="/en" element={<TaxNomadCalculator />} />
          <Route path="/es/calculator" element={<TaxNomadCalculator />} />
          <Route path="/en/calculator" element={<TaxNomadCalculator />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/es/privacy" element={<PrivacyPolicy />} />
          <Route path="/en/privacy" element={<PrivacyPolicy />} />
          <Route path="/es/terms" element={<TermsOfService />} />
          <Route path="/en/terms" element={<TermsOfService />} />
          <Route path="/payment-mock" element={<PaymentMock />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="*" element={<TaxNomadCalculator />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" richColors />
    </I18nProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppShell />
      </Router>
    </ThemeProvider>
  );
}

export default App;
