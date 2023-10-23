import { Navigate, useLocation } from "react-router-dom";

export const PrivateRoute = (path, component, user = null, role = "") => {
  const location = useLocation();

  if (user) {
    if (!role || user.role === role || user.role === "admin")
      return { path, element: component };
    return {
      path: path,
      element: <Navigate to={`/packages`} />,
    };
  } else {
    return {
      path: path,
      element: <Navigate to={`/?redirect=${location.pathname}`} />,
    };
  }
};

export const PublicRoute = (path, component) => {
  return { path, element: component };
};
