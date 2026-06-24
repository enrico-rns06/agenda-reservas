import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function ProfessionalDashboard() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Painel — {user.name}</h1>
        <button style={styles.logoutBtn} onClick={logout}>Sair</button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Agendamentos recebidos</h2>
        {bookings.length === 0 ? (
          <p style={styles.empty}>Nenhum agendamento ainda.</p>
        ) : (
          bookings.map(b => (
            <div key={b.id} style={styles.bookingItem}>
              <div style={styles.bookingInfo}>
                <strong>{b.client_name}</strong>
                <span>{b.client_email}</span>
                <span>{new Date(b.date).toLocaleDateString('pt-BR')} às {b.time.slice(0, 5)}</span>
                <span>{b.service_name} — R$ {b.price}</span>
              </div>
              <div style={styles.actions}>
                <span style={{ ...styles.badge, ...statusColor(b.status) }}>{b.status}</span>
                {b.status === 'pending' && (
                  <>
                    <button style={styles.confirmBtn} onClick={() => updateStatus(b.id, 'confirmed')}>Confirmar</button>
                    <button style={styles.cancelBtn} onClick={() => updateStatus(b.id, 'cancelled')}>Cancelar</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function statusColor(status) {
  if (status === 'confirmed') return { backgroundColor: '#d1fae5', color: '#065f46' };
  if (status === 'cancelled') return { backgroundColor: '#fee2e2', color: '#991b1b' };
  return { backgroundColor: '#fef3c7', color: '#92400e' };
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { color: '#333' },
  logoutBtn: { padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer', backgroundColor: '#fff' },
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  cardTitle: { marginBottom: '1rem', color: '#333' },
  bookingItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #f0f0f0', gap: '1rem' },
  bookingInfo: { display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.9rem', color: '#444' },
  actions: { display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' },
  confirmBtn: { padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none', backgroundColor: '#4f46e5', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' },
  cancelBtn: { padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' },
  error: { color: 'red' },
  empty: { color: '#999' },
};