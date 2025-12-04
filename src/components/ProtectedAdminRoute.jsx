import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import ProductContext from '../context/NewProductContext';
import { isAuthenticated, getDecodedToken } from '../utils/auth';

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated: contextAuth, user } = useContext(ProductContext);
  const location = useLocation();

  // Verify both context state and token validity
  const hasValidToken = isAuthenticated();
  const decodedToken = getDecodedToken();

  // If no valid token, clear context and redirect to login
  if (!hasValidToken || !contextAuth) {
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check admin role from both token and context user
  const isAdmin = (decodedToken?.role === 'ADMIN' || user?.role === 'ADMIN');

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and is an admin
  return children;
};

export default ProtectedAdminRoute;
