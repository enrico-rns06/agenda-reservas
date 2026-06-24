import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingPage from './pages/BookingPage';
import ProfessionalDashboard from './pages/ProfessionalDashboard';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/booking"
        element={
          <PrivateRoute role="client">
            <BookingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute role="professional">
            <ProfessionalDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="*"
        element={
          user?.role === 'professional'
            ? <Navigate to="/dashboard" />
            : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}