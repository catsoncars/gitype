import { useEffect, useMemo, useState } from 'react';
import type { KeyDifficulty, LanguageStats } from '@gitype/shared';
import { fetchKeyDifficulty, fetchLanguageStats, type StatsScope } from '../lib/api';
import { useAuth } from '../features/auth/useAuth';
import { BarChart } from '../features/stats/BarChart';
import './StatsPage.css';

function formatKeyLabel(key: string): string {
  if (key === ' ') return 'space';
  if (key === '\n') return '\\n';
  if (key === '\t') return '\\t';
  return key;
}

export function StatsPage() {
  const { user } = useAuth();
  const [scope, setScope] = useState<StatsScope>('global');
  const [languageStats, setLanguageStats] = useState<LanguageStats[] | null>(null);
  const [keyDifficulty, setKeyDifficulty] = useState<KeyDifficulty[] | null>(null);
  const [languageFilter, setLanguageFilter] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLanguageStats(null);
    setError(null);
    fetchLanguageStats(scope)
      .then(setLanguageStats)
      .catch((err: Error) => setError(err.message));
  }, [scope]);

  useEffect(() => {
    setKeyDifficulty(null);
    setError(null);
    fetchKeyDifficulty(scope, languageFilter || undefined)
      .then(setKeyDifficulty)
      .catch((err: Error) => setError(err.message));
  }, [scope, languageFilter]);

  const totals = useMemo(() => {
    if (!languageStats || languageStats.length === 0) return null;
    return {
      totalRuns: languageStats.reduce((sum, l) => sum + l.runs, 0),
      bestWpm: Math.max(...languageStats.map((l) => l.bestWpm)),
      languageCount: languageStats.length,
    };
  }, [languageStats]);

  if (error) {
    return (
      <section className="page-status">
        <h1>Stats</h1>
        <div className="card page-status-card">
          <p>Couldn't load stats: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="viz-root stats-page">
      <h1>Stats</h1>

      <div className="stats-scope">
        <div className="stats-scope-toggle">
          <button
            type="button"
            className={`btn${scope === 'global' ? ' btn-primary' : ''}`}
            onClick={() => setScope('global')}
          >
            Global
          </button>
          <button
            type="button"
            className={`btn${scope === 'mine' ? ' btn-primary' : ''}`}
            onClick={() => setScope('mine')}
            disabled={!user}
            title={user ? undefined : 'Sign in with GitHub to see your personal stats'}
          >
            My stats
          </button>
        </div>
        {!user && <p className="stats-scope-hint">Sign in with GitHub to see your personal stats.</p>}
      </div>

      {!languageStats ? (
        <p>Loading…</p>
      ) : languageStats.length === 0 ? (
        <div className="card stats-empty">
          <p>No completed runs yet — finish a typing session to see stats here.</p>
        </div>
      ) : (
        <>
          <div className="stat-tiles">
            <div className="card stat-tile">
              <span className="stat-tile-value">{totals?.totalRuns}</span>
              <span className="stat-tile-label">total runs</span>
            </div>
            <div className="card stat-tile">
              <span className="stat-tile-value">{Math.round(totals?.bestWpm ?? 0)}</span>
              <span className="stat-tile-label">best wpm</span>
            </div>
            <div className="card stat-tile">
              <span className="stat-tile-value">{totals?.languageCount}</span>
              <span className="stat-tile-label">languages practiced</span>
            </div>
          </div>

          <div className="card stats-section">
            <h2>Average WPM by language</h2>
            <BarChart
              items={languageStats
                .slice()
                .sort((a, b) => b.avgWpm - a.avgWpm)
                .map((l) => ({ label: l.language, value: l.avgWpm, detail: `${l.runs} runs` }))}
              valueFormat={(v) => Math.round(v).toString()}
            />
          </div>

          <div className="card stats-section">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Language</th>
                  <th>Runs</th>
                  <th>Avg WPM</th>
                  <th>Avg accuracy</th>
                  <th>Best WPM</th>
                </tr>
              </thead>
              <tbody>
                {languageStats.map((l) => (
                  <tr key={l.language}>
                    <td>{l.language}</td>
                    <td>{l.runs}</td>
                    <td>{Math.round(l.avgWpm)}</td>
                    <td>{Math.round(l.avgAccuracy)}%</td>
                    <td>{Math.round(l.bestWpm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="card stats-section">
        <div className="stats-section-header">
          <h2>Hardest keys</h2>
          <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)}>
            <option value="">All languages</option>
            {languageStats?.map((l) => (
              <option key={l.language} value={l.language}>
                {l.language}
              </option>
            ))}
          </select>
        </div>

        {!keyDifficulty ? (
          <p>Loading…</p>
        ) : keyDifficulty.length === 0 ? (
          <p>No key data yet.</p>
        ) : (
          <BarChart
            items={keyDifficulty.map((k) => ({
              label: formatKeyLabel(k.key),
              value: k.errorRate * 100,
              detail: `${k.totalHits} hits, ${k.totalMisses} misses`,
            }))}
            valueFormat={(v) => `${Math.round(v)}%`}
          />
        )}
      </div>
    </section>
  );
}
