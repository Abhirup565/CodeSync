import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ isLoggedIn, authLoading, children }) {
    if (authLoading) return <div>Loading...</div>;

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />
    }
    return children;
}