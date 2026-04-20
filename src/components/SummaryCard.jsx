
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const SummaryCard = ({ title, value, percentage, status }) => {
  // Status colors mapped to tailwind variables
  const statusColorMap = {
    safe: "text-[hsl(var(--success))] bg-[hsl(var(--success)/0.1)] border-[hsl(var(--success)/0.2)]",
    warning: "text-[hsl(var(--warning-foreground))] bg-[hsl(var(--warning)/0.1)] border-[hsl(var(--warning)/0.2)]",
    destructive: "text-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.1)] border-[hsl(var(--destructive)/0.2)]"
  };

  const statusTextMap = {
    safe: "text-[hsl(var(--success))]",
    warning: "text-[hsl(var(--warning-foreground))]",
    destructive: "text-[hsl(var(--destructive))]"
  };

  const currentStatusColor = statusColorMap[status?.color] || "text-foreground bg-card border-border";
  const currentTextColor = statusTextMap[status?.color] || "text-foreground";

  return (
    <Card className={cn(
      "min-h-[200px] rounded-[24px] flex flex-col justify-center items-center text-center p-6",
      "border lift-on-hover shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300",
      currentStatusColor
    )}>
      <h3 
        className="text-muted-foreground font-medium mb-3 tracking-wide text-balance" 
        style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.875rem)' }}
      >
        {title}
      </h3>
      <div 
        className={cn("font-bold mb-2 tracking-tight", currentTextColor)} 
        style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1 }}
      >
        {value}
      </div>
      {percentage !== undefined && (
        <div className="text-sm font-medium opacity-80 mt-2">
          {percentage}%
        </div>
      )}
    </Card>
  );
};

export default SummaryCard;
