import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Ensure this path is correct

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { resetpasswords } = useAuth(); // Hooking into your logic

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      
      const result = await resetpasswords(email);
      
      if (result && result.success) {
       
        setSubmitted(true);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
    
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-shape login-bg-shape-1"></div>
        <div className="login-bg-shape login-bg-shape-2"></div>
        <div className="login-bg-shape login-bg-shape-3"></div>
      </div>

      <div className="login-card">
        <div className="login-brand-panel">
          <div className="login-brand-content">
            <div className="login-brand-logo">🔑</div>
            <h2>Secure Access</h2>
            <p>Don't worry, it happens to the best of us. We'll help you get back into your RentEase account in no time.</p>
          </div>
        </div>

        <div className="login-form-panel">
          {!submitted ? (
            <>
              <div className="login-form-header">
                <h1>Reset Password</h1>
                <p>Enter your email to receive a recovery OTP</p>
              </div>

              {error && <div className="login-alert login-alert-error">{error}</div>}

              <form onSubmit={handleSubmit} className="login-form">
                <div className="login-field">
                  <label htmlFor="reset-email">
                    <span className="login-field-icon">✉️</span>
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="login-spinner"></span>
                  ) : (
                    <>Send Recovery Code <span className="login-btn-arrow">→</span></>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="login-form-header" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📩</div>
              <h1>Check Your Email</h1>
              <p>We have sent a 6-digit OTP to <strong>{email}</strong></p>
              
              {/* Pass the email in state so the next page knows who is resetting */}
              <Link 
                to="/enter-otp" 
                state={{ email }} 
                className="login-submit-btn" 
                style={{ display: 'block', marginTop: '2rem', textDecoration: 'none', textAlign: 'center' }}
              >
                Enter OTP →
              </Link>
            </div>
          )}

          <div className="login-divider">
            <span>Remembered it?</span>
          </div>

          <Link to="/login" className="login-register-link">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;