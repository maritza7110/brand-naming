import ProjectCard from './ProjectCard';
import type { SessionData } from '../../services/sessionService';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface ProjectListProps {
  sessions: SessionData[];
  onDelete: (id: string) => void;
  onSelect: (session: SessionData) => void;
  onPublishToggle: (id: string, isPublic: boolean) => void;
}

export default function ProjectList({ sessions, onDelete, onSelect, onPublishToggle }: ProjectListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.industry_id && s.industry_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="프로젝트 제목 또는 업종 검색..."
          className="w-full bg-[#1A1A1E] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#B48C50]/50 transition-colors"
        />
      </div>

      {filteredSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-500 mb-2">검색 결과가 없거나 프로젝트가 없습니다.</p>
          <p className="text-[#B48C50] text-sm">새로운 프로젝트를 시작해보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => (
            <ProjectCard
              key={session.id}
              session={session}
              onDelete={onDelete}
              onClick={onSelect}
              onPublishToggle={onPublishToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
