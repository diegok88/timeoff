import { useContext } from 'react';
import { AuthContext } from './authcontext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro do AuthProvider');
  return context;
}