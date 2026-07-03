import { useState } from 'react';
import { Send } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
}

// Formulario de nuevo comentario — controla estado de loading y error internamente
// para no contaminar al padre con lógica de UI del formulario.
export function CommentForm({ onSubmit }: CommentFormProps) {
  const [content,    setContent]    = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit(trimmed);
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al publicar el comentario');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        id="comment-input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe tu comentario…"
        rows={3}
        disabled={submitting}
        className="w-full resize-none rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-4 py-3 text-[15px] text-[#F5F5F7] placeholder-[#48484A] outline-none transition-colors focus:border-[#E50914] disabled:opacity-50"
      />
      {error && (
        <p className="text-[13px] text-[#FF453A]">{error}</p>
      )}
      <div className="flex justify-end">
        <button
          id="btn-comment-submit"
          type="submit"
          disabled={submitting || !content.trim()}
          className="btn-primary flex items-center gap-2 py-2 px-5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={15} />
          {submitting ? 'Publicando…' : 'Publicar'}
        </button>
      </div>
    </form>
  );
}
