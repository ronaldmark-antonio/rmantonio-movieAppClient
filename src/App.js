import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminView from './components/AdminView';
import UserView from './components/UserView';
import ViewMovie from './components/ViewMovie';

function AppRoutes({ user, setUser }) {
  const location = useLocation();

  // 🔥 Sync user state after login redirect
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location.pathname, setUser]);

  const RedirectIfLoggedIn = ({ children }) =>
    user.id ? <Navigate to="/movies" replace /> : children;

  const ProtectedRoute = ({ children }) =>
    user.id ? children : <Navigate to="/login" replace />;

  return (
    <Container>
      <Routes>
        <Route
          path="/register"
          element={
            <RedirectIfLoggedIn>
              <Register />
            </RedirectIfLoggedIn>
          }
        />

        <Route
          path="/login"
          element={
            <RedirectIfLoggedIn>
              <Login />
            </RedirectIfLoggedIn>
          }
        />

        <Route path="/" element={<Navigate to="/movies" replace />} />

        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              {user.isAdmin ? <AdminView /> : <UserView />}
            </ProtectedRoute>
          }
        />

        <Route path="/movie/:id" element={<ViewMovie />} />
      </Routes>
    </Container>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : { id: null, isAdmin: false };
    } catch {
      return { id: null, isAdmin: false };
    }
  });

  const [loading, setLoading] = useState(true);

  const unsetUser = () => {
    localStorage.clear();
    setUser({ id: null, isAdmin: false });
  };

  // 🔐 Rehydrate user on refresh
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      unsetUser();
      setLoading(false);
      return;
    }

    fetch('https://movieapp-api-lms1.onrender.com/users/details', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then(data => {
        if (data.user) {
          const userData = {
            id: data.user._id,
            isAdmin: data.user.isAdmin,
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          unsetUser();
        }
      })
      .catch(unsetUser)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-danger" role="status" />
      </div>
    );
  }

  return (
    <Router>
      <AppRoutes user={user} setUser={setUser} />
    </Router>
  );
}

export default App;
