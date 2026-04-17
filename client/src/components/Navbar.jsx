import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

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

        {/* Toggle Button */}
        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Links */}
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

              {/* PROFILE CIRCLE */}
              <div className="navbar-profile">
                <div className="profile-circle">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <div className="profile-dropdown">
                  <button onClick={handleLogout}>🚪 Logout</button>
                </div>
              </div>
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