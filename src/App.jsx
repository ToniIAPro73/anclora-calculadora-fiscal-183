
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop';
import TaxNomadCalculator from './pages/TaxNomadCalculator';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/i18nContext';

function App() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "183-Day Tax Nomad Calculator",
    "applicationCategory": "FinancialApplication",
    "description": "Calculate your days of presence in Spain and the EU to determine tax residency status. Track multiple date ranges and stay compliant with the 183-day rule.",
    "offers": {
      "@type": "Offer",
      "price": "9.99",
      "priceCurrency": "USD"
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        </Helmet>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<TaxNomadCalculator />} />
            <Route path="*" element={<TaxNomadCalculator />} />
          </Routes>
        </Router>
        <Toaster position="top-center" expand={false} richColors />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
