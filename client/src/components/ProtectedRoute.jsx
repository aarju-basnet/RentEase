import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    // 1. USE THE CORRECT KEY
    const userString = localStorage.getItem('rentease_user');
    const user = userString ? JSON.parse(userString) : null;

    if (!user) return <Navigate to="/login" replace />;

    // 2. CHECK ROLE
    if (!user.role || !allowedRoles.includes(user.role)) {
        // If an owner tries to search for /tenant/dashboard, send them back to /owner/dashboard
        const fallback = user.role ? `/${user.role}/dashboard` : "/login";
        return <Navigate to={fallback} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute