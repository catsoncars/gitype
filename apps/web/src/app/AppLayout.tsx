import { NavLink, Outlet } from 'react-router';
import { useAuth } from '../features/auth/useAuth';
import { getGithubLoginUrl } from '../lib/api';
import './AppLayout.css';

export function AppLayout() {
  const { user, loading, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-left">
          <NavLink to="/" className="app-logo" end>
            Gitype
          </NavLink>
          <nav className="app-nav">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/stats">Stats</NavLink>
          </nav>
        </div>
        <div className="app-auth">
          {loading ? null : user ? (
            <div className="app-user">
              {user.avatarUrl && <img src={user.avatarUrl} alt="" className="app-avatar" />}
              <span>{user.username}</span>
              <button type="button" className="btn" onClick={logout}>
                Sign out
              </button>
            </div>
          ) : (
            <a className="btn btn-primary" href={getGithubLoginUrl()}>
              Sign in with GitHub
            </a>
          )}
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
