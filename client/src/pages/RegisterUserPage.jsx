import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Components/AuthContext';
import '../styles/Main.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const RegisterUserPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const { username, password } = form;
    if (!/^[a-zA-Z0-9]+$/.test(username) || username.length < 3 || username.length > 20) {
      return 'Username must be 3–20 alphanumeric characters.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${SERVER_URL}/api/users/`, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      await login(form.username.trim(), form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-name-row">
            <label>
              First Name
              <input
                type="text"
                value={form.firstName}
                onChange={set('firstName')}
                required
                autoFocus
                autoComplete="given-name"
              />
            </label>
            <label>
              Last Name
              <input
                type="text"
                value={form.lastName}
                onChange={set('lastName')}
                required
                autoComplete="family-name"
              />
            </label>
          </div>

          <label>
            Username
            <span className="auth-hint">3–20 letters or numbers</span>
            <input
              type="text"
              value={form.username}
              onChange={set('username')}
              required
              minLength={3}
              maxLength={20}
              autoComplete="username"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              required
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <span className="auth-hint">Minimum 6 characters</span>
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>

          {error && <p className="txt-error">{error}</p>}

          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterUserPage;
