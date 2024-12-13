import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

const PrivateRouteForJobSeeker = ({ element }) => {
  const { currentUserRole } = useAuth();
  const isAuthenticated = !!currentUserRole;
  console.log("CURRROLE",currentUserRole);
  console.log("isAuthen",isAuthenticated);

  return isAuthenticated ? element : <Navigate to="/dang-nhap" />;
};

export default PrivateRouteForJobSeeker;
