import { useAuth } from '../context/useAuth.js';
import { injectAuthContext } from '../api/api.js';

export const ApiInjector = ({ children }) => {
  const auth = useAuth();
  injectAuthContext(auth);
  return children;
};
