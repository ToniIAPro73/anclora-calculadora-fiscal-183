import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  FileArrowDown,
  GlobeHemisphereWest,
  LockKey,
  MoonStars,
  SunHorizon,
} from '@phosphor-icons/react';
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
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/92 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[68px] max-w-[1280px] items-center justify-between gap-3">
          <div
            className="flex cursor-pointer items-center gap-3 shrink-0"
            onClick={() => navigate('/')}
          >
            <BrandLogo
              className="h-11 sm:h-14 w-auto shrink-0"
            />
            <span className="text-lg font-[700] tracking-tight text-foreground sm:text-xl">
              Tax<span className="text-primary">Nomad</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={onOpenModal}
              disabled={!canDownload}
              className={`group hidden h-11 items-center gap-3 px-2 pl-5 sm:inline-flex ${
                canDownload
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <span className="text-sm font-semibold">{t('actions.generatePdf')} · 9,99 €</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/15 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                {canDownload ? <FileArrowDown size={16} weight="bold" /> : <LockKey size={16} weight="bold" />}
              </span>
            </Button>

            {onOpenExample && (
              <Button
                variant="ghost"
                size="sm"
              onClick={onOpenExample}
              className="hidden text-muted-foreground md:inline-flex"
              >
                {t('actions.viewExample')}
                <ArrowUpRight size={14} weight="bold" />
              </Button>
            )}

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                className="h-10 w-10 rounded-md border border-border bg-card"
                aria-label={language === 'es' ? 'Switch language to English' : 'Cambiar idioma a español'}
              >
                <GlobeHemisphereWest size={18} weight="light" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="h-10 w-10 rounded-md border border-border bg-card"
                aria-label={theme === "dark" ? 'Activar modo claro' : 'Activar modo oscuro'}
              >
                {theme === "dark" ? <SunHorizon size={18} weight="light" /> : <MoonStars size={18} weight="light" />}
              </Button>
            </div>
          </div>
      </div>
    </header>
  );
};

export default Header;
