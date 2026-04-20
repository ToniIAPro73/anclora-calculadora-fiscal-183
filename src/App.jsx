import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop';
import TaxNomadCalculator from './pages/TaxNomadCalculator';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import PaymentMock from './pages/PaymentMock';
import PaymentSuccess from './pages/PaymentSuccess';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nProvider } from './contexts/i18nContext';

function App() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "183-Day Tax Nomad Calculator",
    "applicationCategory": "FinancialApplication",
    "offers": { "@type": "Offer", "price": "9.99", "priceCurrency": "EUR" }
  };

  return (
    <ThemeProvider>
      <I18nProvider>
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/"               element={<TaxNomadCalculator />} />
            <Route path="/calculator"     element={<TaxNomadCalculator />} />
            <Route path="/privacy"        element={<PrivacyPolicy />} />
            <Route path="/terms"          element={<TermsOfService />} />
            <Route path="/payment-mock"   element={<PaymentMock />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="*"               element={<TaxNomadCalculator />} />
          </Routes>
        </Router>
        <Toaster position="top-center" richColors />
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
