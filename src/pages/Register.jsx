/**
 * Register Page
 *
 * User registration form with fields for:
 *   - Name, Email, Phone, Password
 *   - Role selection (Tenant / Owner)
 *
 * Uses AuthContext for register and role-based dashboard redirect.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../contexts/AuthContext';
import { registerUser } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form field state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Tenant',
  });

  // Success message state
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Register attempt:', formData);

    // Call the API (will fall back to mock response)
    await registerUser(formData);

    // Use AuthContext register
    const userData = register(
      formData.name,
      formData.email,
      formData.phone,
      formData.password,
      formData.role
    );

    setMessage('Registration successful! Redirecting...');

    // Redirect to role-based dashboard
    setTimeout(() => {
      navigate(getDashboardPath(userData.role));
    }, 800);

    // Clear form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'Tenant',
    });
  };

  return (
    <div className="login-page">
      {/* Animated 3D Background Shapes */}
      <div className="login-bg">
        <div className="login-bg-shape login-bg-shape-1"></div>
        <div className="login-bg-shape login-bg-shape-2"></div>
        <div className="login-bg-shape login-bg-shape-3"></div>
      </div>

      <div className="login-card">
        {/* Left Side: Brand Panel */}
        <div className="login-brand-panel">
          <div className="login-brand-content">
            <div className="login-brand-logo">🏡</div>
            <h2>Join RentEase</h2>
            <p>Create your account in seconds and unlock the best rental experience in Nepal.</p>
            
            <div className="login-brand-features">
              <div className="login-brand-feature">
                <span>✓</span> Verified Properties
              </div>
              <div className="login-brand-feature">
                <span>✓</span> Direct Owner Contact
              </div>
              <div className="login-brand-feature">
                <span>✓</span> Secure Booking
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="login-form-panel">
          <div className="login-form-header">
            <h1>Create Account</h1>
            <p>Start your journey with RentEase today.</p>
          </div>

          {/* Success Message */}
          {message && <div className="login-alert login-alert-success">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="login-field">
                <label htmlFor="register-email">Email Address</label>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="login-field">
                <label htmlFor="register-phone">Phone Number</label>
                <input
                  id="register-phone"
                  type="tel"
                  name="phone"
                  placeholder="+977 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="login-field">
                <label htmlFor="register-password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
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

              <div className="login-field">
                <label htmlFor="register-role">I want to</label>
                <select
                  id="register-role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-group"
                  style={{ width: '100%', padding: '16px 20px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', background: '#f8fafc', transition: 'var(--transition)' }}
                >
                  <option value="Tenant">Rent a Property (Tenant)</option>
                  <option value="Owner">List a Property (Owner)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="login-submit-btn">
              Create Account <span>→</span>
            </button>
          </form>

          <div className="login-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="login-register-link">
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
