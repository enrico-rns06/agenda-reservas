import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav style={styles.nav}>
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

      <div>
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
    padding: '1rem 2rem',
    backgroundColor: '#111',
    borderBottom: '1px solid #2a2a2a',
    position: 'sticky',
    top: 0,
    zIndex: 100,
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
    color: '#f1f1f1',
  },
  links: {
    display: 'flex',
    gap: '2rem',
  },
  link: {
    color: '#888',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
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