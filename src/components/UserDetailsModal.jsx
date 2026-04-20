import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, Lock } from 'lucide-react';

const UserDetailsModal = ({ isOpen, onClose, onConfirm, userData, setUserData, isLoading }) => {
  const { language } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <FileText className="text-primary w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl font-black text-center">
            {language === 'es' ? 'Datos del Informe' : 'Report Details'}
          </DialogTitle>
          <DialogDescription className="text-center italic">
            {language === 'es'
              ? 'Introduce tus datos para personalizar el PDF oficial.'
              : 'Enter your details to personalize the official PDF.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase opacity-60">
              {language === 'es' ? 'Nombre completo' : 'Full name'}
            </Label>
            <Input
              placeholder="Ej. Juan Pérez García"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="rounded-xl border-muted bg-muted/30"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase opacity-60">
              {language === 'es' ? 'DNI / Pasaporte / NIE' : 'ID / Passport'}
            </Label>
            <Input
              placeholder="Ej. 12345678X"
              value={userData.taxId}
              onChange={(e) => setUserData({ ...userData, taxId: e.target.value })}
              className="rounded-xl border-muted bg-muted/30"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            {language === 'es'
              ? 'Estos datos solo se usan para generar tu PDF. No los almacenamos.'
              : 'These details are only used to generate your PDF. We do not store them.'}
          </p>
        </div>

        <DialogFooter>
          <Button
            onClick={onConfirm}
            disabled={isLoading || !userData.name || !userData.taxId}
            className="w-full rounded-full h-12 font-bold text-base shadow-lg gap-2"
          >
            <Lock className="w-4 h-4" />
            {isLoading
              ? (language === 'es' ? 'Redirigiendo…' : 'Redirecting…')
              : (language === 'es' ? 'Ir al pago · 9,99 €' : 'Proceed to payment · €9.99')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
