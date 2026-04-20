
import React from 'react';
import { useTheme } from '@/hooks/useTheme.js';
import { useLanguage } from '@/hooks/useLanguage.js';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              {t('header.title')}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t('header.subtitle')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <div className="flex items-center bg-muted/50 border border-border/50 rounded-lg p-1">
              <button
                onClick={() => setTheme('light')}
                className={cn("p-1.5 rounded-md transition-all", theme === 'light' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                aria-label="Light mode"
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cn("p-1.5 rounded-md transition-all", theme === 'dark' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                aria-label="Dark mode"
              >
                <Moon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={cn("p-1.5 rounded-md transition-all", theme === 'system' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                aria-label="System theme"
              >
                <Monitor className="h-4 w-4" />
              </button>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center bg-muted/50 border border-border/50 rounded-lg p-1">
              <button
                onClick={() => setLanguage('es')}
                className={cn("px-3 py-1 rounded-md text-xs font-semibold transition-all", language === 'es' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                aria-label="Switch to Spanish"
              >
                ES
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={cn("px-3 py-1 rounded-md text-xs font-semibold transition-all", language === 'en' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                aria-label="Switch to English"
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
