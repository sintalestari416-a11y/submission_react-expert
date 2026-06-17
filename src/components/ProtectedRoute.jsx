/**
 * components/ProtectedRoute.jsx
 * Route guard: redirect ke /login jika user belum autentikasi.
 */

import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

function ProtectedRoute({ children }) {
  const authUser = useSelector((state) => state.authUser);

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
