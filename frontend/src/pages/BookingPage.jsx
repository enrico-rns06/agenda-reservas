import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function BookingPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    professional_id: searchParams.get('professional') || '',
    service_id: '',
    date: '',
    time: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [servicesRes, usersRes, bookingsRes] = await Promise.all([
        api.get('/services'),
        api.get('/users'),
        api.get('/bookings'),
      ]);
      setServices(servicesRes.data);
      setProfessionals(usersRes.data.filter(u => u.role === 'professional'));
      setBookings(bookingsRes.data.filter(b => b.client_name === user.name));
    } catch (err) {
      setError('Erro ao carregar dados');
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/bookings', { ...form, client_id: user.id });
      setSuccess('Agendamento realizado com sucesso!');
      setForm({ professional_id: '', service_id: '', date: '', time: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao agendar');
    }
  }

  const selectedProfessional = professionals.find(p => p.id === parseInt(form.professional_id));

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Novo agendamento</h1>

        <div style={styles.grid}>
          <div className="glass-card" style={styles.formCard}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Profissional</label>
                <select className="glass-input" style={styles.input} name="professional_id" value={form.professional_id} onChange={handleChange} required>
                  <option value="">Selecione o profissional</option>
                  {professionals.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Servico</label>
                <select className="glass-input" style={styles.input} name="service_id" value={form.service_id} onChange={handleChange} required>
                  <option value="">Selecione o servico</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} — {s.duration_minutes}min — R$ {s.price}</option>
                  ))}
                </select>
              </div>

              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Data</label>
                  <input className="glass-input" style={styles.input} type="date" name="date" value={form.date} onChange={handleChange} required />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Horario</label>
                  <input className="glass-input" style={styles.input} type="time" name="time" value={form.time} onChange={handleChange} required />
                </div>
              </div>

              {selectedProfessional && (
                <div className="glass-card" style={styles.selectedCard}>
                  <div style={styles.selectedAvatar}>{selectedProfessional.name.charAt(0)}</div>
                  <div>
                    <p style={styles.selectedName}>{selectedProfessional.name}</p>
                    <p style={styles.selectedEmail}>{selectedProfessional.email}</p>
                  </div>
                </div>
              )}

              {error && <p style={styles.error}>{error}</p>}
              {success && <p style={styles.success}>{success}</p>}
              <button style={styles.button} type="submit">Confirmar agendamento</button>
            </form>
          </div>

          <div className="glass-card" style={styles.listCard}>
            <h2 style={styles.listTitle}>Meus agendamentos</h2>
            {bookings.length === 0 ? (
              <p style={styles.empty}>Nenhum agendamento ainda.</p>
            ) : (
              bookings.map(b => (
                <div key={b.id} style={styles.bookingItem}>
                  <div style={styles.bookingAvatar}>{b.professional_name.charAt(0)}</div>
                  <div style={styles.bookingInfo}>
                    <p style={styles.bookingName}>{b.professional_name}</p>
                    <p style={styles.bookingDetail}>{b.service_name}</p>
                    <p style={styles.bookingDetail}>{new Date(b.date).toLocaleDateString('pt-BR')} as {b.time.slice(0, 5)}</p>
                  </div>
                  <span style={{ ...styles.badge, ...statusColor(b.status) }}>{b.status}</span>
                </div>
              ))
            )}
          </div>
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
  container: { maxWidth: '900px', margin: '0 auto' },
  title: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  formCard: { padding: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  label: { fontSize: '0.85rem', color: 'var(--text-muted)' },
  input: { padding: '0.75rem 1rem', fontSize: '0.95rem' },
  selectedCard: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem' },
  selectedAvatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#22c55e', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 },
  selectedName: { fontSize: '0.95rem', fontWeight: '600' },
  selectedEmail: { fontSize: '0.8rem', color: 'var(--text-muted)' },
  button: { padding: '0.85rem', backgroundColor: '#22c55e', color: '#000', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '1rem' },
  error: { color: '#f87171', fontSize: '0.85rem' },
  success: { color: '#4ade80', fontSize: '0.85rem' },
  listCard: { padding: '1.5rem' },
  listTitle: { fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' },
  empty: { color: 'var(--text-muted)', fontSize: '0.9rem' },
  bookingItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)' },
  bookingAvatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#22c55e', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 },
  bookingInfo: { flex: 1 },
  bookingName: { fontSize: '0.95rem', fontWeight: '600' },
  bookingDetail: { fontSize: '0.8rem', color: 'var(--text-muted)' },
  badge: { padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', flexShrink: 0 },
};