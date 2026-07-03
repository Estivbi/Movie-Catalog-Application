import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import type { Comment } from '../../lib/api';

interface CommentListProps {
  comments:    Comment[];
  currentUserId?: string;
  onEdit:      (id: string, newContent: string) => Promise<void>;
  onDelete:    (id: string) => Promise<void>;
}

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);

  if (mins  < 1)  return 'ahora mismo';
  if (mins  < 60) return `hace ${mins}m`;
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${days}d`;
}

// CommentList con edición inline para comentarios propios.
// La edición abre un textarea en la misma fila sin modal para no interrumpir el flujo.
export function CommentList({ comments, currentUserId, onEdit, onDelete }: CommentListProps) {
  const [editingId,      setEditingId]      = useState<string | null>(null);
  const [editContent,    setEditContent]    = useState('');
  const [savingId,       setSavingId]       = useState<string | null>(null);
  const [deletingId,     setDeletingId]     = useState<string | null>(null);

  if (comments.length === 0) {
    return (
      <p className="py-8 text-center text-[15px] text-[#48484A]">
        Aún no hay comentarios. ¡Sé el primero en opinar!
      </p>
    );
  }

  async function handleSave(id: string) {
    const trimmed = editContent.trim();
    if (!trimmed) return;
    setSavingId(id);
    try {
      await onEdit(id, trimmed);
      setEditingId(null);
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => {
        const isOwn     = comment.user_id === currentUserId;
        const isEditing = editingId === comment.id;

        return (
          <li
            key={comment.id}
            className="rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] p-4"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#86868B]">
                {isOwn ? 'Tú' : 'Usuario'}
              </span>
              <span className="text-[12px] text-[#48484A]">
                {timeAgo(comment.created_at)}
              </span>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  id={`edit-comment-${comment.id}`}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-[#E50914] bg-[#1A1A1A] px-3 py-2 text-[14px] text-[#F5F5F7] outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(comment.id)}
                    disabled={!!savingId}
                    className="btn-primary flex items-center gap-1 py-1 px-3 text-[13px] disabled:opacity-40"
                  >
                    <Check size={13} />
                    {savingId === comment.id ? 'Guardando…' : 'Guardar'}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn-ghost text-[13px]"
                  >
                    <X size={13} />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <p className="text-[14px] leading-relaxed text-[#F5F5F7]/85">
                  {comment.content}
                </p>
                {isOwn && (
                  <div className="flex shrink-0 gap-1">
                    <button
                      id={`btn-edit-comment-${comment.id}`}
                      onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }}
                      className="btn-ghost p-1"
                      aria-label="Editar comentario"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      id={`btn-delete-comment-${comment.id}`}
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingId === comment.id}
                      className="btn-ghost p-1 hover:text-[#FF453A] disabled:opacity-40"
                      aria-label="Borrar comentario"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
