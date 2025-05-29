// authcontext.tsx
import { createContext, ReactNode, useState } from 'react';
import { Usuario } from '../inteface/usuario';

type AuthContextType = {
    user: Usuario | null;
    login: (usuario: Usuario) => void;
    logout: () => void;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Usuario | null>(null);

    const login = (usuario: Usuario) => setUser(usuario);
    const logout = () => setUser(null);
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext };