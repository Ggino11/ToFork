"use client";

import { createContext, useContext, useEffect, ReactNode, useState } from "react";
import { User } from "../../../../../types/auth";

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

    // ⭐ Inizializzazione: carica da localStorage al mount
    useEffect(() => {
        const initAuth = () => {
            try {
                const storedToken = localStorage.getItem("token");
                const storedUser = localStorage.getItem("user");

                console.log('🔵 AuthContext inizializzazione:', {
                    hasToken: !!storedToken,
                    hasUser: !!storedUser
                });

                if (storedToken && storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    console.log('✅ Utente recuperato da localStorage:', parsedUser);
                    setToken(storedToken);
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error("❌ Errore durante inizializzazione auth:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    // ⭐ Funzione login
    const login = (newToken: string, userData: User) => {
        console.log('🟢 Login chiamato con:', { token: newToken, user: userData });

        // Salva in localStorage
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));

        // Aggiorna stato
        setToken(newToken);
        setUser(userData);

        console.log('✅ Login completato, stato aggiornato');
    };

    // ⭐ Funzione logout
    const logout = () => {
        console.log('🔴 Logout chiamato');

        // Chiamata API logout (opzionale)
        if (token) {
            fetch("http://localhost:8081/auth/logout", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).catch(err => console.error("Errore logout API:", err));
        }

        // Pulisci tutto
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token && !!user;

    // ⭐ Log ogni volta che lo stato cambia (debug)
    useEffect(() => {
        console.log('🔵 AuthContext stato aggiornato:', {
            isAuthenticated,
            hasToken: !!token,
            hasUser: !!user,
            user: user
        });
    }, [isAuthenticated, token, user]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
