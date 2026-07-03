type BadgeVariant = 'visible' | 'hidden' | 'neutral';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

// Badge de estado para el panel admin: visible/oculto con colores Apple del spec.
export function Badge({ variant, children }: BadgeProps) {
  const styles: Record<BadgeVariant, string> = {
    visible: 'bg-[rgba(48,209,88,0.15)] text-[#30D158]',
    hidden:  'bg-[rgba(255,69,58,0.15)]  text-[#FF453A]',
    neutral: 'bg-[rgba(255,255,255,0.08)] text-[#86868B]',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.07em] ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
