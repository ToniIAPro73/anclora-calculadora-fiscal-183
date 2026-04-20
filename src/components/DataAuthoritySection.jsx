
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage.js';

const DataAuthoritySection = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border rounded-[20px] transition-colors duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>{t('authority.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-relaxed">
          <section>
            <h4 className="font-semibold mb-2 text-foreground">{t('authority.whatIsTitle')}</h4>
            <p className="text-muted-foreground">
              {t('authority.whatIsDesc')}
            </p>
          </section>

          <section>
            <h4 className="font-semibold mb-2 text-foreground">{t('authority.whatCountsTitle')}</h4>
            <p className="text-muted-foreground mb-2">
              {t('authority.whatCountsDesc')}
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>{t('authority.whatCountsList1')}</li>
              <li>{t('authority.whatCountsList2')}</li>
              <li>{t('authority.whatCountsList3')}</li>
              <li>{t('authority.whatCountsList4')}</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold mb-2 text-foreground">{t('authority.exceptionsTitle')}</h4>
            <p className="text-muted-foreground mb-2">
              {t('authority.exceptionsDesc')}
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>{t('authority.exceptionsList1')}</li>
              <li>{t('authority.exceptionsList2')}</li>
              <li>{t('authority.exceptionsList3')}</li>
              <li>{t('authority.exceptionsList4')}</li>
              <li>{t('authority.exceptionsList5')}</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold mb-2 text-foreground">{t('authority.sourcesTitle')}</h4>
            <div className="space-y-2">
              <a 
                href="https://sede.agenciatributaria.gob.es/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline transition-all duration-200"
              >
                <ExternalLink className="h-4 w-4" />
                {t('authority.source1')}
              </a>
              <a 
                href="https://taxation-customs.ec.europa.eu/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline transition-all duration-200"
              >
                <ExternalLink className="h-4 w-4" />
                {t('authority.source2')}
              </a>
            </div>
          </section>

          <div className="pt-4 border-t border-border">
            <div className="flex gap-3 p-4 bg-[hsl(var(--warning)/0.1)] rounded-xl border border-[hsl(var(--warning)/0.2)]">
              <AlertCircle className="h-5 w-5 text-[hsl(var(--warning-foreground))] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold block mb-1 text-foreground">{t('authority.disclaimerTitle')}</span>
                {t('authority.disclaimerDesc')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataAuthoritySection;
