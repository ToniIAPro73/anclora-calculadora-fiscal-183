
import React, { useState } from 'react';
import { FileText, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage.js';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const StripePaymentButton = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentClick = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Mock Stripe flow delay
    setTimeout(() => {
      setIsLoading(false);
      toast.info(t('toast.stripeMock'), {
        duration: 5000,
        position: 'top-center',
      });
    }, 2500);
  };

  return (
    <div className="relative w-full group lift-on-hover">
      {/* Decorative gradient background for premium feel */}
      <div className={cn(
        "absolute -inset-0.5 bg-gradient-to-r from-primary via-blue-400 to-primary rounded-xl blur transition duration-500",
        isLoading ? "opacity-60 animate-pulse" : "opacity-30 group-hover:opacity-50"
      )}></div>
      
      <Button 
        onClick={handlePaymentClick}
        disabled={isLoading}
        className={cn(
          "relative w-full min-h-[4rem] h-auto rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold overflow-hidden flex items-center justify-between p-4 border border-primary/20 whitespace-normal text-left transition-all",
          isLoading && "opacity-90 cursor-not-allowed"
        )}
      >
        <span 
          className="flex items-center gap-3 relative z-10 flex-1"
          style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin shrink-0" />
          ) : (
            <FileText className="h-5 w-5 shrink-0" />
          )}
          <span className="leading-snug">{t('actions.downloadPdf')}</span>
        </span>
        
        {!isLoading && (
          <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
        )}
        
        {/* Shimmer effect overlay */}
        <div className={cn(
          "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent z-0",
          isLoading ? "animate-shimmer-fast via-white/30" : "animate-[shimmer_2.5s_infinite]"
        )}></div>
      </Button>
    </div>
  );
};

export default StripePaymentButton;
