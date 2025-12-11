
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

export const ProtectedRoute = () => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Not logged in -> Go to Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but not Admin -> Show Error or Home (handled in LoginPage ideally, but here we block route)
    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }

    // Authorized -> Show Admin Layout
    return <Outlet />;
};
