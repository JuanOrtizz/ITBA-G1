import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function ProtectedRoute({ children, soloAdmin = false }) {
    
    const { currentUser } = useContext(AuthContext);
    const location = useLocation();
    
    if (!currentUser) {
        return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
    }
    
    if (soloAdmin && currentUser.rol !== "admin") {
        return <p className="mensaje-estado">Necesitás ser administrador para ver esta página.</p>;
    }
    
    return children;
}

export default ProtectedRoute;