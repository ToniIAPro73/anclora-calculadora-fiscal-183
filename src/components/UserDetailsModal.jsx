import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Article, CheckCircle, LockKey } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

const UserDetailsModal = ({ isOpen, onClose, onConfirm, userData, setUserData, isLoading }) => {
  const { language, t } = useLanguage();

  const documentTypes = [
    { value: 'passport', label: t('userDetails.documentTypePassport') },
    { value: 'nie', label: t('userDetails.documentTypeNie') },
  ];

  const selectedDocumentLabel = userData.documentType === 'nie'
    ? t('userDetails.documentTypeNie')
    : t('userDetails.documentTypePassport');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-[2rem] border-white/10 bg-card/95 p-0">
        <div className="double-shell rounded-[2rem]">
          <div className="double-shell-core rounded-[calc(2rem-0.375rem)] px-6 py-6">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
            <Article className="text-primary" size={24} weight="light" />
          </div>
          <DialogTitle className="text-center text-2xl font-[650] tracking-[-0.05em]">
            {t('userDetails.title')}
          </DialogTitle>
          <DialogDescription className="text-center text-sm leading-7">
            {t('userDetails.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase opacity-60">{t('userDetails.nameLabel')}</Label>
            <Input
              placeholder="Ej. Juan Pérez García"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="rounded-xl border-muted bg-muted/30"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase opacity-60">{t('userDetails.documentLabel')}</Label>
            <div className="grid grid-cols-2 gap-2">
              {documentTypes.map((option) => {
                const isSelected = userData.documentType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setUserData({ ...userData, documentType: option.value })}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-[1.25rem] border px-3 py-3 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      isSelected
                        ? "border-primary/20 bg-primary/10 text-primary shadow-[0_18px_36px_-24px_hsl(var(--primary)/0.8)]"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {isSelected && <CheckCircle size={16} weight="fill" />}
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase opacity-60">
              {language === 'es' ? `Número de ${selectedDocumentLabel}` : `${selectedDocumentLabel} number`}
            </Label>
            <Input
              placeholder={t('userDetails.taxIdPlaceholder')}
              value={userData.taxId}
              onChange={(e) => setUserData({ ...userData, taxId: e.target.value })}
              className="rounded-xl border-muted bg-muted/30"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            {t('userDetails.note')}
          </p>
        </div>

        <DialogFooter>
          <Button
            onClick={onConfirm}
            disabled={isLoading || !userData.name || !userData.taxId}
            className="h-12 w-full gap-2 text-base font-semibold"
          >
            <LockKey size={16} weight="bold" />
            {isLoading
              ? t('userDetails.redirecting')
              : `${t('userDetails.confirm')} · 9,99 €`}
          </Button>
        </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
