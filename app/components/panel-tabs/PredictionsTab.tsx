'use client';

import { Clock } from 'lucide-react';

export function PredictionsTab() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Clock className="w-8 h-8 text-muted-foreground mb-2" />
      <p className="text-sm font-medium text-foreground">Coming Soon</p>
      <p className="text-xs text-muted-foreground mt-1">Market predictions</p>
    </div>
  );
}
