/**
 * Navbar Component
 *
 * Dark navy navigation bar matching the screenshot design.
 * Dynamically shows links based on auth state:
 *   - Logged out: Home, Properties, Login, Register
 *   - Logged in:  Home, Properties, Dashboard, Logout
 */

import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // State to toggle mobile menu open/close
  const [menuOpen, setMenuOpen] = useState(false);

  // State to add shadow on scroll
  const [scrolled, setScrolled] = useState(false);

  // Listen for scroll events to toggle shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when a link is clicked
  const closeMenu = () => setMenuOpen(false);

  // Handle logout
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">🏠</span>
          RentEase
        </NavLink>

        {/* Hamburger toggle button (visible on mobile) */}
        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation links — dynamic based on auth state */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" onClick={closeMenu}>
            🏠 Home
          </NavLink>
          <NavLink to="/properties" onClick={closeMenu}>
            🏘️ Properties
          </NavLink>

          {user ? (
            <>
              <NavLink to={getDashboardPath(user.role)} onClick={closeMenu}>
                📊 Dashboard
              </NavLink>
              <button className="navbar-logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu}>
                🔑 Login
              </NavLink>
              <NavLink to="/register" onClick={closeMenu}>
                👤 Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
