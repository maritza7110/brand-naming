import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UploadedDocument {
  id: string;
  name: string;
  type: 'txt' | 'pdf';
  content: string;
  uploadedAt: string;
}

interface SettingsState {
  apiKey: string;
  documents: UploadedDocument[];
}

interface SettingsActions {
  setApiKey: (key: string) => void;
  setDocuments: (docs: UploadedDocument[]) => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      apiKey: '',
      documents: [],

      setApiKey: (key) => set({ apiKey: key }),
      setDocuments: (docs) => set({ documents: docs }),
    }),
    {
      name: 'brand-naming-settings',
      partialize: (state) => ({ apiKey: state.apiKey }),
    },
  ),
);
