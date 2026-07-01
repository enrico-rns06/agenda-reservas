import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [usersRes, servicesRes] = await Promise.all([
          api.get('/users'),
          api.get('/services'),
        ]);
        setProfessionals(usersRes.data.filter(u => u.role === 'professional'));
        setServices(servicesRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  const filtered = professionals.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleBook(professionalId) {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/booking?professional=${professionalId}`);
  }

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Seja bem-vindo</h1>
        <p style={styles.heroDate}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</p>
        <div className="glass-card" style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            className="glass-input"
            style={styles.searchInput}
            type="text"
            placeholder="Buscar profissional..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Profissionais disponíveis</h2>
        {filtered.length === 0 ? (
          <p style={styles.empty}>Nenhum profissional encontrado.</p>
        ) : (
          <div style={styles.grid}>
            {filtered.map(p => (
              <div key={p.id} className="glass-card" style={styles.card}>
                <div style={styles.avatar}>
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div style={styles.cardInfo}>
                  <h3 style={styles.cardName}>{p.name}</h3>
                  <p style={styles.cardEmail}>{p.email}</p>
                  <p style={styles.cardServices}>
                    {services.map(s => s.name).join(' · ')}
                  </p>
                </div>
                <button style={styles.cardBtn} onClick={() => handleBook(p.id)}>
                  Agendar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
  },
  hero: {
    padding: '2rem 1.5rem 2rem',
    maxWidth: '900px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.25rem',
  },
  heroDate: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    marginBottom: '1.5rem',
    textTransform: 'capitalize',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
  },
  searchIcon: {
    fontSize: '1rem',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    width: '100%',
  },
  section: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '1rem 1.5rem 3rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  empty: {
    color: 'var(--text-muted)',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
  },
  avatar: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1.25rem',
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '0.15rem',
  },
  cardEmail: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: '0.25rem',
  },
  cardServices: {
    fontSize: '0.8rem',
    color: '#22c55e',
  },
  cardBtn: {
    padding: '0.5rem 1.25rem',
    backgroundColor: '#22c55e',
    color: '#000',
    border: 'none',
    borderRadius: '999px',
    fontWeight: '600',
    fontSize: '0.85rem',
    flexShrink: 0,
  },
};