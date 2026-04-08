import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { GallerySession } from '../../types/gallery';
import { sessionService } from '../../services/sessionService';
import { useGalleryStore } from '../../store/useGalleryStore';
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';
import CommentSection from './CommentSection';

interface GalleryModalProps {
  session: GallerySession;
  onClose: () => void;
}

export default function GalleryModal({ session, onClose }: GalleryModalProps) {
  const likeCounts = useGalleryStore((s) => s.likeCounts);

  // ESC 키 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // input_data에서 주요 필드 추출 (옵셔널 체이닝 — Pitfall 5)
  const inputData = session.input_data ?? {};
  const analysisFields = [
    { label: '경쟁사', value: inputData?.competitors },
    { label: '시장 트렌드', value: inputData?.marketTrend },
    { label: 'USP', value: inputData?.usp },
  ].filter((f) => f.value);

  const identityFields = [
    { label: '브랜드 퍼스낼리티', value: inputData?.brandPersonality },
    { label: '비전', value: inputData?.longTermGoal || inputData?.ceoVision },
    { label: '타겟 고객', value: inputData?.targetCustomer || inputData?.customerDefinition },
  ].filter((f) => f.value);

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal container */}
      <div
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl max-w-[720px] w-full max-h-[90vh] overflow-y-auto animate-fadeIn p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-[20px] font-semibold text-[var(--color-text-primary)]">{session.title}</h2>
            {session.industry_id && (
              <span className="inline-block bg-[var(--color-border)] text-[var(--color-text-secondary)] text-[12px] px-2 py-1 rounded-full mt-2">
                {session.industry_id}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* 입력 요약 섹션 */}
        {(analysisFields.length > 0 || identityFields.length > 0) && (
          <div className="mb-6">
            <h3 className="text-[14px] text-[var(--color-text-muted)] mb-3">입력 요약</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...analysisFields, ...identityFields].map((field, i) => (
                <div key={i} className="bg-[var(--color-bg)] rounded-xl p-3">
                  <p className="text-[12px] text-[var(--color-text-muted)] mb-1">{field.label}</p>
                  <p className="text-[14px] text-[var(--color-text-secondary)]">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 추천 브랜드명 목록 — 전체 표시 */}
        <div className="mb-6">
          <h3 className="text-[14px] text-[var(--color-text-muted)] mb-3">추천 브랜드명</h3>
          <div className="space-y-3">
            {session.naming_results.map((result, i) => (
              <div key={i} className="bg-[var(--color-bg)] rounded-xl p-4">
                <p className="text-[16px] font-semibold text-[var(--color-accent)] mb-1">{result.brand_name}</p>
                {result.reasoning && (
                  <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">{result.reasoning}</p>
                )}
              </div>
            ))}
            {session.naming_results.length === 0 && (
              <p className="text-[14px] text-[var(--color-text-muted)]">추천된 브랜드명이 없습니다</p>
            )}
          </div>
        </div>

        {/* 피드백 영역 — LikeButton + BookmarkButton */}
        <div className="flex items-center gap-2 border-t border-[var(--color-border)] pt-4">
          <LikeButton sessionId={session.id} count={likeCounts[session.id] ?? 0} />
          <BookmarkButton sessionId={session.id} />
          <span className="text-[12px] text-[var(--color-text-muted)] ml-auto">
            {session.profiles?.full_name || '익명'} · {sessionService.formatDate(session.created_at)}
          </span>
        </div>

        {/* 댓글 섹션 (per D-06) */}
        <hr className="border-[var(--color-border)] my-4" />
        <CommentSection sessionId={session.id} />
      </div>
    </div>
  );
}
