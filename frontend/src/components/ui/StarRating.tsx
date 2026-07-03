import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
  /** Valor actual (1-5). null = sin valorar. */
  value:      number | null;
  /** Si es false, las estrellas son solo de lectura. */
  interactive?: boolean;
  onRate?:    (score: number) => void;
  size?:      number;
}

// Componente dual: lectura (catálogo, detalle) e interactivo (formulario de rating).
export function StarRating({
  value,
  interactive = false,
  onRate,
  size = 20,
}: StarRatingProps) {
  // hover solo tiene sentido en modo interactivo
  const [hovered, setHovered] = useState<number | null>(null);

  const displayed = hovered ?? value ?? 0;

  return (
    <div
      className="flex items-center gap-1"
      role={interactive ? 'group' : undefined}
      aria-label={interactive ? 'Calificación de película' : undefined}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= displayed;

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(null)}
            aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
            className={`transition-transform duration-150 ${
              interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'
            } disabled:cursor-default border-none bg-transparent p-0 outline-none`}
          >
            <Star
              size={size}
              fill={filled ? '#FFD60A' : 'transparent'}
              color={filled ? '#FFD60A' : '#48484A'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
