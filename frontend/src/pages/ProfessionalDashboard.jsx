import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function ProfessionalDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data.filter(b => b.professional_name === user.name));
    } catch (err) {
      setError('Erro ao carregar agendamentos');
    }
  }

  async function updateStatus(id, status) {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      loadBookings();
    } catch (err) {
      setError('Erro ao atualizar status');
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Painel</h1>
            <p style={styles.subtitle}>Bem-vindo, {user.name}</p>
          </div>
          <div style={styles.statsRow}>
            {[
              { label: 'Pendentes', value: counts.pending, color: '#fb923c' },
              { label: 'Confirmados', value: counts.confirmed, color: '#4ade80' },
              { label: 'Total', value: counts.all, color: 'var(--text)' },
            ].map(s => (
              <div key={s.label} className="glass-card" style={styles.statCard}>
                <span style={{ ...styles.statNum, color: s.color }}>{s.value}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.filters}>
          {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
            <button
              key={f}
              className={filter === f ? '' : 'glass-card'}
              style={{
                ...styles.filterBtn,
                ...(filter === f ? styles.filterBtnActive : {}),
              }}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendentes' : f === 'confirmed' ? 'Confirmados' : 'Cancelados'}
              <span style={styles.filterCount}>{counts[f]}</span>
            </button>
          ))}
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.list}>
          {filtered.length === 0 ? (
            <p style={styles.empty}>Nenhum agendamento encontrado.</p>
          ) : (
            filtered.map(b => (
              <div key={b.id} className="glass-card" style={styles.card}>
                <div style={styles.cardLeft}>
                  <div style={styles.avatar}>{b.client_name.charAt(0)}</div>
                  <div style={styles.info}>
                    <p style={styles.clientName}>{b.client_name}</p>
                    <p style={styles.detail}>{b.client_email}</p>
                    <p style={styles.detail}>{b.service_name} — R$ {b.price}</p>
                    <p style={styles.detail}>{new Date(b.date).toLocaleDateString('pt-BR')} as {b.time.slice(0, 5)}</p>
                  </div>
                </div>
                <div style={styles.cardRight}>
                  <span style={{ ...styles.badge, ...statusColor(b.status) }}>{b.status}</span>
                  {b.status === 'pending' && (
                    <div style={styles.actions}>
                      <button style={styles.confirmBtn} onClick={() => updateStatus(b.id, 'confirmed')}>Confirmar</button>
                      <button style={styles.cancelBtn} onClick={() => updateStatus(b.id, 'cancelled')}>Cancelar</button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function statusColor(status) {
  if (status === 'confirmed') return { backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' };
  if (status === 'cancelled') return { backgroundColor: 'rgba(248, 113, 113, 0.15)', color: '#f87171' };
  return { backgroundColor: 'rgba(251, 146, 60, 0.15)', color: '#fb923c' };
}

const styles = {
  page: { minHeight: '100vh', padding: '1rem 1.5rem 2rem' },
  container: { maxWidth: '800px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontSize: '1.75rem', fontWeight: '700' },
  subtitle: { color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' },
  statsRow: { display: 'flex', gap: '0.75rem' },
  statCard: { padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' },
  statNum: { fontSize: '1.5rem', fontWeight: '700' },
  statLabel: { fontSize: '0.75rem', color: 'var(--text-muted)' },
  filters: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  filterBtn: { padding: '0.5rem 1rem', border: '1px solid var(--glass-border)', borderRadius: '999px', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'transparent' },
  filterBtnActive: { backgroundColor: '#22c55e', color: '#000', borderColor: '#22c55e', fontWeight: '600' },
  filterCount: { backgroundColor: 'var(--glass-bg-strong)', borderRadius: '999px', padding: '0 0.4rem', fontSize: '0.75rem' },
  error: { color: '#f87171', marginBottom: '1rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  empty: { color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' },
  card: { padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' },
  cardLeft: { display: 'flex', alignItems: 'center', gap: '1rem' },
  avatar: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#22c55e', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem', flexShrink: 0 },
  info: { display: 'flex', flexDirection: 'column', gap: '0.15rem' },
  clientName: { fontSize: '0.95rem', fontWeight: '600' },
  detail: { fontSize: '0.8rem', color: 'var(--text-muted)' },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' },
  actions: { display: 'flex', gap: '0.5rem' },
  confirmBtn: { padding: '0.4rem 0.8rem', backgroundColor: '#22c55e', color: '#000', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.8rem' },
  cancelBtn: { padding: '0.4rem 0.8rem', backgroundColor: 'transparent', color: '#f87171', border: '1px solid #f87171', borderRadius: '8px', fontWeight: '600', fontSize: '0.8rem' },
};