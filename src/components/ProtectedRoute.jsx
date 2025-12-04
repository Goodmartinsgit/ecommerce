import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import ProductContext from '../context/NewProductContext';
import { isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated: contextAuth } = useContext(ProductContext);
  const location = useLocation();

  // Verify both context state and token validity
  const hasValidToken = isAuthenticated();

  // If no valid token, redirect to login
  if (!hasValidToken || !contextAuth) {
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // User is authenticated
  return children;
};

export default ProtectedRoute;
