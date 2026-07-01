import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="glass-card" style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <span style={styles.logoIcon}>A</span>
        <span style={styles.logoText}>Agenda</span>
      </Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Inicio</Link>
        {user && (
          <Link
            to={user.role === 'professional' ? '/dashboard' : '/booking'}
            style={styles.link}
          >
            {user.role === 'professional' ? 'Painel' : 'Meus Agendamentos'}
          </Link>
        )}
      </div>

      <div style={styles.right}>
        <button
          style={styles.themeBtn}
          onClick={toggleTheme}
          aria-label="Alternar tema"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {user ? (
          <button style={styles.btn} onClick={handleLogout}>Sair</button>
        ) : (
          <Link to="/login" style={styles.btn}>Entrar</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.9rem 1.5rem',
    margin: '1rem 1.5rem',
    position: 'sticky',
    top: '1rem',
    zIndex: 100,
    borderRadius: '999px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    backgroundColor: '#22c55e',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  logoText: {
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  links: {
    display: 'flex',
    gap: '2rem',
  },
  link: {
    color: 'var(--text-muted)',
    textDecoration: 'none',
    fontSize: '0.95rem',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  themeBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    border: '1px solid var(--glass-border)',
    backgroundColor: 'var(--glass-bg-strong)',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    padding: '0.5rem 1.25rem',
    backgroundColor: '#22c55e',
    color: '#000',
    border: 'none',
    borderRadius: '999px',
    fontWeight: '600',
    fontSize: '0.9rem',
    textDecoration: 'none',
    display: 'inline-block',
  },
};