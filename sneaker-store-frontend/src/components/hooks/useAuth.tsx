// src/hooks/useAuth.ts
import { useState, useEffect, useContext, createContext, useCallback } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Verifica la existencia del token y datos de usuario al cargar
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error parsing user data:', error);
                // Limpiar datos corruptos
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
            }
        }
    }, []);

    const login = useCallback((token: string, userData: User) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        setIsLoggedIn(true);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
        setIsLoggedIn(false);
    }, []);

    const value = { isLoggedIn, user, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};