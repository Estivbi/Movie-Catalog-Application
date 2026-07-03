import { useEffect, useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { fetchAdminComments, toggleCommentVisibility, type Comment } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from '../components/ui/Badge';

export function AdminPage() {
  const { session } = useAuth();
  const [comments,   setComments]   = useState<Comment[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    async function load() {
      setLoading(true);
      try {
        const { comments: data } = await fetchAdminComments(session!.access_token);
        setComments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los comentarios');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [session]);

  async function handleToggle(commentId: string) {
    if (!session) return;
    setTogglingId(commentId);
    try {
      const { comment: updated } = await toggleCommentVisibility(commentId, session.access_token);
      // Actualizamos solo la fila afectada, sin recargar toda la tabla
      setComments(prev => prev.map(c => c.id === commentId ? updated : c));
    } catch {
      // Mantenemos el estado anterior si el toggle falla
    } finally {
      setTogglingId(null);
    }
  }

  const visibleCount = comments.filter(c => !c.is_hidden).length;
  const hiddenCount  = comments.filter(c =>  c.is_hidden).length;

  return (
    <div className="min-h-screen bg-[#000] pt-24 pb-16">
      <main className="mx-auto max-w-5xl px-6">

        {/* Encabezado */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E50914]/10">
            <Shield size={18} className="text-[#E50914]" />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold text-[#F5F5F7]">Panel de administración</h1>
            <p className="text-[13px] text-[#86868B]">Moderación de comentarios</p>
          </div>
        </div>

        {/* Stats rápidas */}
        {!loading && !error && (
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-5 py-3">
              <span className="text-[13px] text-[#86868B]">Total: </span>
              <span className="font-semibold text-[#F5F5F7]">{comments.length}</span>
            </div>
            <div className="rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-5 py-3">
              <span className="text-[13px] text-[#86868B]">Visibles: </span>
              <span className="font-semibold text-[#30D158]">{visibleCount}</span>
            </div>
            <div className="rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-5 py-3">
              <span className="text-[13px] text-[#86868B]">Ocultos: </span>
              <span className="font-semibold text-[#FF453A]">{hiddenCount}</span>
            </div>
          </div>
        )}

        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-16 w-full rounded-xl" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-center text-[#FF453A]">{error}</p>
        )}

        {!loading && !error && comments.length === 0 && (
          <p className="py-12 text-center text-[14px] text-[#48484A]">
            No hay comentarios todavía.
          </p>
        )}

        {/* Tabla de comentarios */}
        {!loading && !error && comments.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-[#2A2A2A]">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#86868B]">Película</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#86868B]">Comentario</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#86868B]">Fecha</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#86868B]">Estado</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#86868B]">Acción</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, idx) => (
                  <tr
                    key={comment.id}
                    className={`border-b border-[#2A2A2A] transition-colors hover:bg-[#111] ${
                      idx % 2 === 0 ? 'bg-[#0A0A0A]' : 'bg-[#111]'
                    }`}
                  >
                    <td className="px-4 py-3 text-[#86868B]">
                      #{comment.tmdb_movie_id}
                    </td>
                    <td className="max-w-xs px-4 py-3">
                      <p className="line-clamp-2 text-[#F5F5F7]/80">{comment.content}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[12px] text-[#86868B]">
                      {new Date(comment.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={comment.is_hidden ? 'hidden' : 'visible'}>
                        {comment.is_hidden ? 'Oculto' : 'Visible'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        id={`btn-toggle-comment-${comment.id}`}
                        onClick={() => handleToggle(comment.id)}
                        disabled={togglingId === comment.id}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors disabled:opacity-40 border ${
                          comment.is_hidden
                            ? 'border-[#30D158]/30 bg-[#30D158]/10 text-[#30D158] hover:bg-[#30D158]/20'
                            : 'border-[#FF453A]/30 bg-[#FF453A]/10 text-[#FF453A] hover:bg-[#FF453A]/20'
                        }`}
                      >
                        {togglingId === comment.id ? (
                          '…'
                        ) : comment.is_hidden ? (
                          <><Eye size={12} /> Mostrar</>
                        ) : (
                          <><EyeOff size={12} /> Ocultar</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
