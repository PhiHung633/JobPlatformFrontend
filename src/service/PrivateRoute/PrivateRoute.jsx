import { Navigate } from "react-router-dom";

const PrivateRoute = ({ roles, userRole, children }) => {
  console.log("User Role:", userRole);
  console.log("Allowed Roles:", roles);
  
  if (!userRole) {
    return <div>Loading...</div>;
  }

  if (!roles.includes(userRole)) {
    console.warn(`Access denied for role: ${userRole}`);
    return <Navigate to="/403" />;
  }

  return children;
};

export default PrivateRoute;
