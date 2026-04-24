import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Navbar from './components/Navbar'
import Register from './pages/Register'
import Login from './pages/Login'
import Properties from './pages/Properties';
import TenantDashboard from './pages/TenantDashboard'
import OwnerDashboard from './pages/PropertyOwnerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Resetpassword from './pages/resetpassword'
import PropertyDetails from './pages/PropertyDetails';
import AddProperty from './pages/AddProperty'
import Verifyotp from './pages/verifyotp'

function App() {
  return (
    <>
    <Navbar/>
      <Routes>

        {/* 🔓 Public Routes */}
        <Route path='/' element={<Home/>}/>
        <Route path ='/register' element ={<Register/>}/>
        <Route path="/login" element={<Login />} />
        <Route path='/properties' element={<Properties/>}/>
        <Route path='/reset-password' element={<Resetpassword/>}/>
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path='/enter-otp' element={<Verifyotp/>}/>

        {/* 🔒 Tenant Routes */}
        <Route element={<ProtectedRoute allowedRoles={['tenant']} />}>
          <Route path="/tenant/dashboard" element={<TenantDashboard />} />
        </Route>

        {/* 🔒 Owner Routes */}
        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path='/add-property' element={<AddProperty/>}/>
        </Route>

        {/* 🔒 Admin Routes */}
        
          <Route path="/internal-secret-gate-99/dashboard" element={<AdminDashboard />} />
       

        {/* ❌ Unauthorized fallback */}
        <Route path="/unauthorized" element={<h1>Access Denied ❌</h1>} />

      </Routes>
   </>
  );
}

export default App;