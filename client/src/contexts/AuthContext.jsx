import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../services/api';

const AuthContext = createContext();





 
export const getDashboardPath = (role) => {
  switch (role) {
    case 'admin': return '/internal-secret-gate-99/dashboard';
    case 'owner': return '/owner/dashboard';
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



const createContact = async (formData) => {
  try {
    const { data } = await API.post("/contact", formData);

    if (data.success) {
      return { success: true, message: "Message sent successfully" };
    }

    return { success: false, message: "Something went wrong" };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Server error" };
  }
}


 const register = async (formData) => {
  try {
    const { data } = await API.post('/auth/register', formData);
    
    if (data.success) {
  
  localStorage.setItem('rentease_user', JSON.stringify(data.user));

 
  localStorage.setItem('token', data.token);


  setUser(data.user);

  toast.success(data.message || 'Registration Successful!');
  return { success: true, user: data.user };
}
  } catch (error) {
    const msg = error.response?.data?.message || "Registration failed";
    toast.error(msg);
    return { success: false };
  }
};
 
 
  const login = async (formData) => {
  try {
    const { data } = await API.post('/auth/login', formData);

    if (data.success) {
      localStorage.setItem('rentease_user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      setUser(data.user);

      return { success: true, user: data.user };
    }
  } catch (error) {
    return { success: false };
  }
};
   const resetpasswords = async (email) => {
    try {
      const res = await API.post('/auth/reset-password', { email });
      if (res.data.success) toast.success("Reset Otp has sent to your email");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
      throw err;
    }
  };

  const enterotp = async (email, password, otp) => {
    try {
      const res = await API.post('/auth/enter-otp', { email, password, otp });
      if (res.data.success) toast.success("Password changed successfully");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
      throw err;
    }
  }; 
  const logout = () => {
    setUser(null);
    localStorage.removeItem('rentease_user');
  };


const updateUser = (updatedUser) => {
  // This is the most important part: update BOTH the storage and the state
  localStorage.setItem('rentease_user', JSON.stringify(updatedUser));
  setUser(updatedUser);
};

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getDashboardPath ,
      resetpasswords, enterotp, createContact, updateUser
    }}>
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


export default AuthContext;