'use client';

import { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { User } from '../../../types/auth';

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;
// }
interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); 

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        // Al primo caricamento, controlla se c'è un token nel localStorage
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                // Se trovai dati, validiamo il token con il backend
                validateToken(storedToken, JSON.parse(storedUser));
            } else {
                setIsLoading(false); // Nessun dato, smettiamo di caricare
            }
        } catch (error) {
            console.error("Failed to parse auth data from storage", error);
            logout(); 
            setIsLoading(false);
        }
    }, []);

    const validateToken = async (tokenToValidate: string, userToSet: User) => {
        try {
    
            const response = await fetch('http://localhost:8081/auth/validate', {
                headers: {
                    'Authorization': `Bearer ${tokenToValidate}`
                }
            });

            const data = await response.json();

            if (data.valid) {
                console.log("Token validation successful:", data.user);
                login(tokenToValidate, data.user);
            } else {
                console.log("Token validation failed, logging out.");
                logout();
            }
        } catch (error) {
            console.error('Error validating token:', error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };


    const login = (newToken: string, userData: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        // Chiamata all'endpoint di logout del backend 
        fetch('http://localhost:8081/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).catch(err => console.error("Logout API call failed:", err));

        // Pulizia lato client 
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};