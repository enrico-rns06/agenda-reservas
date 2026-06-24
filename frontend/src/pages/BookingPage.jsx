import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function BookingPage() {
  const { user, logout } = useAuth();
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ professional_id: '', service_id: '', date: '', time: '' });
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
    console.log('services:', servicesRes.data);
    console.log('users:', usersRes.data);
    setServices(servicesRes.data);
    setProfessionals(usersRes.data.filter(u => u.role === 'professional'));
    setBookings(bookingsRes.data.filter(b => b.client_name === user.name));
  } catch (err) {
    console.error('Erro loadData:', err);
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Olá, {user.name}</h1>
        <button style={styles.logoutBtn} onClick={logout}>Sair</button>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Novo agendamento</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <select style={styles.input} name="professional_id" value={form.professional_id} onChange={handleChange} required>
            <option value="">Selecione o profissional</option>
            {professionals.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select style={styles.input} name="service_id" value={form.service_id} onChange={handleChange} required>
            <option value="">Selecione o serviço</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name} — {s.duration_minutes}min — R$ {s.price}</option>
            ))}
          </select>
          <input style={styles.input} type="date" name="date" value={form.date} onChange={handleChange} required />
          <input style={styles.input} type="time" name="time" value={form.time} onChange={handleChange} required />
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <button style={styles.button} type="submit">Agendar</button>
        </form>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Meus agendamentos</h2>
        {bookings.length === 0 ? (
          <p style={styles.empty}>Nenhum agendamento ainda.</p>
        ) : (
          bookings.map(b => (
            <div key={b.id} style={styles.bookingItem}>
              <span>{new Date(b.date).toLocaleDateString('pt-BR')} às {b.time.slice(0, 5)}</span>
              <span>{b.service_name} com {b.professional_name}</span>
              <span style={{ ...styles.badge, ...statusColor(b.status) }}>{b.status}</span>
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
  container: { maxWidth: '700px', margin: '0 auto', padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { color: '#333' },
  logoutBtn: { padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer', backgroundColor: '#fff' },
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '1.5rem' },
  cardTitle: { marginBottom: '1rem', color: '#333' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: { padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' },
  button: { padding: '0.75rem', borderRadius: '6px', border: 'none', backgroundColor: '#4f46e5', color: '#fff', fontSize: '1rem', cursor: 'pointer' },
  error: { color: 'red', fontSize: '0.875rem' },
  success: { color: 'green', fontSize: '0.875rem' },
  empty: { color: '#999' },
  bookingItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderBottom: '1px solid #f0f0f0' },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' },
};