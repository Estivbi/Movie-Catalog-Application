import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

// Efecto visual ligero tipo Magic UI: brillo sutil, borde vivo y profundidad al pasar el cursor.
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0a0f1d] transition duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_22px_80px_rgba(0,0,0,0.6)]',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)] opacity-80 transition duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_32%,rgba(249,115,22,0.05))] opacity-80" />
      {children}
    </div>
  );
}
