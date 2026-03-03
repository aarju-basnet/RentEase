/**
 * App.jsx - Root Application Component
 *
 * Sets up React Router with routes for all 6 pages.
 * Wraps page content with the Navbar (top) and Footer (bottom)
 * so they appear consistently on every page.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth context
import { AuthProvider } from './contexts/AuthContext';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page components
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProperty from './pages/AddProperty';

// Dashboard components
import AdminDashboard from './pages/AdminDashboard';
import PropertyOwnerDashboard from './pages/PropertyOwnerDashboard';
import TenantDashboard from './pages/TenantDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
      {/* Navbar appears on every page */}
      <Navbar />

      {/* Main content area — renders the matching page route */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-property" element={<AddProperty />} />
          
          {/* Dashboards */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/property-owner/dashboard" element={<PropertyOwnerDashboard />} />
          <Route path="/tenant/dashboard" element={<TenantDashboard />} />
        </Routes>
      </main>

      {/* Footer appears on every page */}
      <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
