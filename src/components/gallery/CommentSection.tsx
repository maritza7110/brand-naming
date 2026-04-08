import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useSocialStore } from '../../store/useSocialStore';
import { useAuthStore } from '../../store/useAuthStore';
import type { CommentData } from '../../types/gallery';

interface CommentSectionProps {
  sessionId: string;
}

function CommentItem({
  comment,
  currentUserId,
  onDelete,
}: {
  comment: CommentData;
  currentUserId: string | undefined;
  onDelete: (id: string) => void;
}) {
  const isOwner = currentUserId === comment.user_id;
  return (
    <div className="flex justify-between items-start gap-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-[var(--color-text-secondary)]">
            {comment.profiles?.full_name || '익명'}
          </span>
          <span className="text-[12px] text-[#5A5550]">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ko })}
          </span>
        </div>
        <p className="text-[14px] text-[var(--color-text-primary)] whitespace-pre-wrap mt-1 break-words">
          {comment.content}
        </p>
      </div>
      {isOwner && (
        <button
          onClick={() => onDelete(comment.id)}
          className="text-[#5A5550] hover:text-[#EF4444] transition-colors cursor-pointer flex-shrink-0 mt-1"
          aria-label="댓글 삭제"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

export default function CommentSection({ sessionId }: CommentSectionProps) {
  const { comments, isCommentsLoading, fetchComments, addComment, deleteComment } = useSocialStore();
  const user = useAuthStore((s) => s.user);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchComments(sessionId);
  }, [sessionId, fetchComments]);

  const handleSubmit = () => {
    if (!content.trim() || !user) return;
    addComment(sessionId, user.id, content.trim(), user.email ?? '익명');
    setContent('');
  };

  return (
    <div className="space-y-4">
      {/* 댓글 목록 헤더 */}
      {isCommentsLoading ? (
        <p className="text-[14px] text-[var(--color-text-muted)] text-center py-4">댓글을 불러오는 중...</p>
      ) : comments.length === 0 ? (
        <p className="text-[14px] text-[var(--color-text-muted)] text-center py-4">아직 댓글이 없습니다</p>
      ) : (
        <>
          <p className="text-[14px] font-semibold text-[var(--color-text-muted)] mb-3">
            댓글 {comments.length}개
          </p>
          <div className="space-y-3 max-h-[240px] overflow-y-auto">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
                onDelete={deleteComment}
              />
            ))}
          </div>
        </>
      )}

      {/* 댓글 입력 폼 */}
      {user ? (
        <div className="mt-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
            placeholder="댓글을 입력하세요..."
            className="min-h-[80px] w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 text-[14px] text-[var(--color-text-primary)] placeholder-[#5A5550] focus:border-[var(--color-accent)] focus:outline-none resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmit}
              className="text-[14px] font-semibold text-[var(--color-accent)] hover:text-[#C5A06B] transition-colors cursor-pointer"
            >
              댓글 작성
            </button>
          </div>
        </div>
      ) : (
        <p className="text-[14px] text-[var(--color-text-muted)] text-center py-4">
          댓글을 작성하려면 로그인하세요
        </p>
      )}
    </div>
  );
}
