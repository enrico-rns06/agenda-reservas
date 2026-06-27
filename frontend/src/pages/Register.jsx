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
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>A</span>
          <span style={styles.logoText}>Agenda</span>
        </div>
        <h2 style={styles.title}>Criar conta</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Nome completo</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Seu nome"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>E-mail</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Senha</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Perfil</label>
            <select
              style={styles.input}
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="client">Cliente</option>
              <option value="professional">Profissional</option>
            </select>
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.button} type="submit">Cadastrar</button>
        </form>
        <p style={styles.link}>
          Ja tem conta? <Link to="/login" style={styles.linkGreen}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  card: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    padding: '2rem',
    width: '100%',
    maxWidth: '400px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
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
  title: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#f1f1f1',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.85rem',
    color: '#888',
  },
  input: {
    padding: '0.75rem 1rem',
    backgroundColor: '#242424',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    color: '#f1f1f1',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    padding: '0.85rem',
    backgroundColor: '#22c55e',
    color: '#000',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '1rem',
    marginTop: '0.5rem',
  },
  error: {
    color: '#f87171',
    fontSize: '0.85rem',
  },
  link: {
    textAlign: 'center',
    marginTop: '1.25rem',
    color: '#888',
    fontSize: '0.9rem',
  },
  linkGreen: {
    color: '#22c55e',
    textDecoration: 'none',
    fontWeight: '600',
  },
};