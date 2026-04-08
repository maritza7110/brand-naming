import { Trash2, Calendar, Layout, Globe, EyeOff } from 'lucide-react';
import { sessionService } from '../../services/sessionService';
import type { SessionData } from '../../services/sessionService';

interface ProjectCardProps {
  session: SessionData;
  onDelete: (id: string) => void;
  onClick: (session: SessionData) => void;
  onPublishToggle: (id: string, isPublic: boolean) => void;
}

export default function ProjectCard({ session, onDelete, onClick, onPublishToggle }: ProjectCardProps) {
  return (
    <div
      className="group relative bg-[var(--color-surface)] border border-white/5 rounded-2xl p-5 hover:border-[var(--color-accent)]/30 transition-all cursor-pointer overflow-hidden"
      onClick={() => onClick(session)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-[var(--color-accent)]/10 rounded-lg">
          <Layout className="text-[var(--color-accent)]" size={20} />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('프로젝트를 삭제하시겠습니까?')) {
              onDelete(session.id);
            }
          }}
          className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <h3 className="text-white font-bold text-lg mb-1 truncate">{session.title}</h3>
      <div className="flex flex-col gap-1.5 mt-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Calendar size={14} />
          <span>{sessionService.formatDate(session.created_at)}</span>
        </div>
        <div className="text-[var(--color-accent)]/70 text-[13px] font-medium mt-1">
          {session.industry_id || '산업분류 미지정'}
        </div>
      </div>

      {/* 발행/철회 UI */}
      <div className="mt-4 pt-3 border-t border-white/5">
        {session.is_public ? (
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full inline-flex items-center gap-1">
              <Globe size={12} />
              공개중
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPublishToggle(session.id, false);
              }}
              className="text-[var(--color-text-muted)] hover:text-red-400 text-[13px] transition-colors flex items-center gap-1"
            >
              <EyeOff size={13} />
              발행 철회
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPublishToggle(session.id, true);
            }}
            className="w-full flex items-center justify-center gap-1.5 bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30 rounded-lg px-3 py-2 text-[13px] hover:bg-[var(--color-accent)]/20 transition-colors"
          >
            <Globe size={14} />
            갤러리에 발행
          </button>
        )}
      </div>

      {/* 장식용 그라데이션 */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent pointer-events-none" />
    </div>
  );
}
