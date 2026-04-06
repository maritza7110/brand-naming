import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NamingPage from './pages/NamingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import GalleryPage from './pages/GalleryPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { supabase } from './services/supabase';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    // 현재 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuth(session?.user ?? null, session);
    });

    // 인증 상태 변화 리스너 설정
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(session?.user ?? null, session);
    });

    return () => subscription.unsubscribe();
  }, [setAuth]);

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <NamingPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gallery"
        element={
          <ProtectedRoute>
            <GalleryPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
