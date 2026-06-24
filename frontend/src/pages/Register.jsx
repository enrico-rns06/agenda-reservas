import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' });
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/users', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar');
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Agenda de Reservas</h1>
        <h2 style={styles.subtitle}>Criar conta</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Nome completo"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            required
          />
          <select
            style={styles.input}
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="client">Cliente</option>
            <option value="professional">Profissional</option>
          </select>
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.button} type="submit">Cadastrar</button>
        </form>
        <p style={styles.link}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: { textAlign: 'center', marginBottom: '0.25rem', color: '#333' },
  subtitle: { textAlign: 'center', marginBottom: '1.5rem', color: '#666', fontWeight: 'normal' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' },
  button: { padding: '0.75rem', borderRadius: '6px', border: 'none', backgroundColor: '#4f46e5', color: '#fff', fontSize: '1rem', cursor: 'pointer' },
  error: { color: 'red', fontSize: '0.875rem' },
  link: { textAlign: 'center', marginTop: '1rem', color: '#666' },
};