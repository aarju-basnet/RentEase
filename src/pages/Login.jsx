/**
 * Login Page
 *
 * Premium login form with glassmorphism card, animated gradient,
 * and role-based redirect via AuthContext.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../contexts/AuthContext';
import { loginUser } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(formData);
      const userData = login(formData.email, formData.password);
      setMessage('Welcome back! Redirecting...');

      setTimeout(() => {
        navigate(getDashboardPath(userData.role));
      }, 800);
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background shapes */}
      <div className="login-bg">
        <div className="login-bg-shape login-bg-shape-1"></div>
        <div className="login-bg-shape login-bg-shape-2"></div>
        <div className="login-bg-shape login-bg-shape-3"></div>
      </div>

      <div className="login-card">
        {/* Left panel — branding */}
        <div className="login-brand-panel">
          <div className="login-brand-content">
            <div className="login-brand-logo">🏠</div>
            <h2>RentEase</h2>
            <p>Find your perfect rental in Nepal. Connect with property owners and discover homes across Kathmandu, Pokhara, Chitwan & more.</p>
            <div className="login-brand-features">
              <div className="login-brand-feature">
                <span>✓</span> Verified Properties
              </div>
              <div className="login-brand-feature">
                <span>✓</span> Trusted Owners
              </div>
              <div className="login-brand-feature">
                <span>✓</span> Secure Bookings
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="login-form-panel">
          <div className="login-form-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue to your dashboard</p>
          </div>

          {message && <div className="login-alert login-alert-success">{message}</div>}
          {error && <div className="login-alert login-alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="login-email">
                <span className="login-field-icon">✉️</span>
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password">
                <span className="login-field-icon">🔒</span>
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="login-spinner"></span>
              ) : (
                <>Sign In <span className="login-btn-arrow">→</span></>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>New to RentEase?</span>
          </div>

          <Link to="/register" className="login-register-link">
            Create an account <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
