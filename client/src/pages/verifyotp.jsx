import { useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

const VerifyOTP = () => {
  const { enterotp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from navigation state (passed from the Forgot Password page)
  const email = location.state?.email || "";

  // 1. OTP State: Array of 6 strings for the boxes
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const [formData, setFormData] = useState({
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 2. Handle Individual OTP Box Changes
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    // Only allow numbers
    if (isNaN(value)) return;

    const newOtp = [...otpArray];
    // Only take the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtpArray(newOtp);

    // Auto-focus move to next box
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    setError('');
  };

  // 3. Handle Backspace Logic
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // 4. Handle Paste Logic (Pasting all 6 digits at once)
  const handlePaste = (e) => {
    const data = e.clipboardData.getData("text").trim();
    if (data.length === 6 && !isNaN(data)) {
      setOtpArray(data.split(""));
      inputRefs.current[5].focus();
    }
    e.preventDefault();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalOtp = otpArray.join("");

    if (finalOtp.length !== 6) {
      return setError("Please enter the full 6-digit OTP code");
    }

    if (!formData.password) {
      return setError("Please enter a new password");
    }

    setLoading(true);
    try {
      // Calling the context function: enterotp(email, password, otp)
      const result = await enterotp(email, formData.password, finalOtp);
      
      if (result && result.success) {
        // Success! Wait a moment then go to login
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
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
            <div className="login-brand-logo">🛡️</div>
            <h2>Security Check</h2>
            <p>Verify your identity and set a strong new password to keep your RentEase account safe.</p>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-form-header">
            <h1>Create New Password</h1>
            <p>Verification for <strong>{email || 'your account'}</strong></p>
          </div>

          {error && <div className="login-alert login-alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            
            {/* 6 HORIZONTAL OTP BOXES */}
            <div className="login-field" style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '12px', textAlign: 'center', color: '#475569', fontWeight: '500' }}>
                <span className="login-field-icon">🔢</span>
                Enter 6-Digit OTP
              </label>
              <div className='boxes'
                style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }} 
                onPaste={handlePaste}
              >
                {otpArray.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    ref={(el) => (inputRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    autoComplete="one-time-code"
                    style={{
                      width: '42px',
                      height: '50px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      textAlign: 'center',
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      backgroundColor: '#ffffff',
                      color: '#0f172a', // DARK COLOR - So you can see the digits
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      padding: '0',
                      borderColor: digit ? '#7c3aed' : '#e2e8f0',
                      boxShadow: digit ? '0 0 10px rgba(124, 58, 237, 0.15)' : 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7c3aed';
                      e.target.style.backgroundColor = '#f8f5ff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = digit ? '#7c3aed' : '#e2e8f0';
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Password Field */}
            <div className="login-field">
              <label htmlFor="password">
                <span className="login-field-icon">🔒</span>
                New Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ color: '#0f172a' }} // Dark text for password too
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                <span className="login-spinner"></span>
              ) : (
                <>Update Password <span className="login-btn-arrow">→</span></>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>Problem?</span>
          </div>

          <Link to="/reset-password" style={{ textAlign: 'center', display: 'block' }} className="login-register-link">
            Resend OTP code <span>↺</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;