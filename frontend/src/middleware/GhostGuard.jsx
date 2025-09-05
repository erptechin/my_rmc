// Import Dependencies
import { Navigate, useOutlet } from "react-router";

// Local Imports
import { useAuthContext } from "app/contexts/auth/context";
import { HOME_PATH } from "constants/app.constant";

// ----------------------------------------------------------------------

export default function GhostGuard() {

  const outlet = useOutlet();
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to={HOME_PATH} />;
  }

  return <>{outlet}</>;
}
