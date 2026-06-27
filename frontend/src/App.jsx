import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingPage from './pages/BookingPage';
import ProfessionalDashboard from './pages/ProfessionalDashboard';

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
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
          element={<Navigate to="/" />}
        />
      </Routes>
    </>
  );
}