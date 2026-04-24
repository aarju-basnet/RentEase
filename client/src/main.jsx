import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <AuthProvider>
     <App />
   </AuthProvider>
   
  </BrowserRouter>,
)
