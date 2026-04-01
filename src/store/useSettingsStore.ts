import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UploadedDocument {
  id: string;
  name: string;
  type: 'txt' | 'pdf';
  content: string;
  uploadedAt: string; // ISO string (Date는 persist 시 직렬화 문제)
}

interface SettingsState {
  apiKey: string;
  documents: UploadedDocument[];
}

interface SettingsActions {
  setApiKey: (key: string) => void;
  addDocument: (doc: UploadedDocument) => void;
  removeDocument: (id: string) => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      apiKey: '',
      documents: [],

      setApiKey: (key) => set({ apiKey: key }),

      addDocument: (doc) =>
        set((state) => ({ documents: [...state.documents, doc] })),

      removeDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        })),
    }),
    { name: 'brand-naming-settings' },
  ),
);
