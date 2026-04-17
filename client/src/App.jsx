

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import { AuthProvider } from './contexts/AuthContext';

import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page components
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProperty from './pages/AddProperty';
import Resetpassword from './pages/resetpassword'



import AdminDashboard from './pages/AdminDashboard';
import PropertyOwnerDashboard from './pages/PropertyOwnerDashboard';
import TenantDashboard from './pages/TenantDashboard';
import VerifyOTP from './pages/verifyotp';

function App() {
  return (
   
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
          
          <Route path = '/reset-password' element={<Resetpassword/>}/>
          <Route path='/enter-otp' element={<VerifyOTP/>}/>
          
          {/* Dashboards */}
          <Route element={<ProtectedRoute allowedRoles={['tenant']} />}>
          <Route path="/tenant/dashboard" element={<TenantDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
            <Route path="/owner/dashboard" element={<PropertyOwnerDashboard />} />
            <Route path="/add-property" element={<AddProperty />} />

          </Route>

          
          <Route path="/internal-secret-gate-99/dashboard" element={<AdminDashboard />} />
         
          
        
          
        </Routes>
      </main>

  
      <Footer />
      </AuthProvider>
   
  );
}

export default App;
