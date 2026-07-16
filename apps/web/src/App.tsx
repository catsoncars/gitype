import { BrowserRouter, Route, Routes } from 'react-router';
import { AppLayout } from './app/AppLayout';
import { AuthProvider } from './features/auth/AuthContext';
import { HomePage } from './pages/HomePage';
import { TypingPage } from './pages/TypingPage';
import { ResultsPage } from './pages/ResultsPage';
import { StatsPage } from './pages/StatsPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="type" element={<TypingPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="auth/callback" element={<AuthCallbackPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
