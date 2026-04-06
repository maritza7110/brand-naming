import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { loadGuidelines } from './services/guidelineLoader'
import { useSettingsStore } from './store/useSettingsStore'

loadGuidelines().then((docs) => {
  useSettingsStore.getState().setDocuments(docs);
}).catch(() => {
  // 지침 파일 없으면 기본 모드로 동작
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
