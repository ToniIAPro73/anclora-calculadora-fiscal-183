import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Moon, Sun, FileDown, Eye, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import BrandLogo from '@/components/BrandLogo';

const Header = ({ totalDays = 0, onOpenModal, onOpenExample }) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const canDownload = totalDays > 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-3 sm:gap-4">

          {/* Logo */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0"
            onClick={() => navigate('/')}
          >
            <BrandLogo
              variant={theme === 'dark' ? 'dark' : 'light'}
              className="h-11 sm:h-14 w-auto shrink-0"
            />
            <span className="text-lg sm:text-2xl font-black tracking-tighter text-foreground">
              Tax<span className="text-primary">Nomad</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">

            {onOpenExample && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenExample}
                className="hidden md:flex text-muted-foreground hover:text-primary gap-2 font-semibold"
              >
                <Eye className="w-4 h-4" />
                {t('actions.viewExample')}
              </Button>
            )}

            <Button
              onClick={onOpenModal}
              disabled={!canDownload}
              className={`rounded-full h-10 transition-all gap-2 shadow-lg border-b-2 active:border-b-0 active:translate-y-0.5 ${
                canDownload
                ? 'bg-primary hover:bg-primary/90 border-primary-foreground/20 shadow-primary/20 px-4 sm:px-6'
                : 'bg-muted text-muted-foreground opacity-50 px-3 cursor-not-allowed'
              }`}
            >
              <FileDown className="w-4 h-4" />
              <span className="font-bold flex items-center gap-1.5 text-sm">
                <span className="hidden sm:inline">
                  {language === 'es' ? 'Generar PDF' : 'Generate PDF'}
                </span>
                <span className="bg-black/20 px-2 py-0.5 rounded-md text-[10px]">
                  9,99€
                </span>
              </span>
              <Lock className="w-3 h-3 opacity-50 hidden xs:block" />
            </Button>

            <div className="h-6 w-[1px] bg-border mx-1 hidden xs:block" />

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                className="rounded-full h-9 w-9"
              >
                <Globe className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="rounded-full h-9 w-9"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
