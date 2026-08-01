import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(t('admin.login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lotus-800 flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <svg width="44" height="50" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M32 8C32 8 20 20 20 34C20 43 25 50 32 54C39 50 44 43 44 34C44 20 32 8 32 8Z" fill="#F0C9C0" />
          </svg>
        </div>
        <div className="bg-cream rounded-3xl p-8 shadow-card">
          <h1 className="font-display text-2xl text-lotus-800 mb-1 text-center">{t('admin.login.title')}</h1>
          <p className="text-sm text-ink/50 text-center mb-7">{t('admin.login.subtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1.5">{t('admin.login.email')}</label>
              <input
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-lotus-200 rounded-xl px-4 py-3 focus:border-lotus-700 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1.5">{t('admin.login.password')}</label>
              <input
                type="password"
                required
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-lotus-200 rounded-xl px-4 py-3 focus:border-lotus-700 outline-none transition-colors"
              />
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lotus-700 text-cream font-medium py-3 rounded-xl hover:bg-lotus-800 disabled:opacity-60 transition-colors"
            >
              {t('admin.login.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
