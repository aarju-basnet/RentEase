/**
 * AuthContext.jsx
 *
 * Provides authentication state and actions (login, register, logout)
 * using localStorage for persistence. Includes demo accounts for testing.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// Demo accounts for testing
const DEMO_ACCOUNTS = [
  { email: 'admin@rentease.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { email: 'rajesh@rentease.com', password: 'owner123', name: 'Rajesh Shrestha', role: 'owner' },
  { email: 'hari@rentease.com', password: 'tenant123', name: 'Hari Prasad', role: 'tenant' },
];

/**
 * Returns the dashboard path for a given user role.
 */
export const getDashboardPath = (role) => {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'owner': return '/property-owner/dashboard';
    case 'tenant': return '/tenant/dashboard';
    default: return '/';
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('rentease_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('rentease_user');
      }
    }
  }, []);

  /**
   * Login with email & password.
   * Checks demo accounts first, then allows any email as a mock login.
   * Returns the user object with role on success.
   */
  const login = (email, password) => {
    const demo = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );

    if (demo) {
      const userData = { name: demo.name, email: demo.email, role: demo.role };
      setUser(userData);
      localStorage.setItem('rentease_user', JSON.stringify(userData));
      return userData;
    }

    // Mock fallback: determine role from email pattern
    let role = 'tenant';
    if (email.toLowerCase().includes('admin')) role = 'admin';
    else if (email.toLowerCase().includes('owner') || email.toLowerCase().includes('rajesh')) role = 'owner';

    const userData = { name: email.split('@')[0], email, role };
    setUser(userData);
    localStorage.setItem('rentease_user', JSON.stringify(userData));
    return userData;
  };

  /**
   * Register a new user and log them in immediately.
   * Returns the user object with role.
   */
  const register = (name, email, phone, password, role) => {
    const userRole = role === 'Owner' ? 'owner' : 'tenant';
    const userData = { name, email, role: userRole };
    setUser(userData);
    localStorage.setItem('rentease_user', JSON.stringify(userData));
    return userData;
  };

  /**
   * Log the user out — clear state and localStorage.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('rentease_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getDashboardPath }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access auth context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { DEMO_ACCOUNTS };
export default AuthContext;
