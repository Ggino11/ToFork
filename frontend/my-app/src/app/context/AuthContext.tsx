'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '../../../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

  const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'AUTH_START':
            return{
                ...state,
                isLoading: true,
                error: null, 
            };
        case 'AUTH_SUCCESS':
            return{
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case'AUTH_ERROR':
            return{
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };
            case 'LOGOUT':
      return {
        ...initialState,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

  // Check for existing token on app start
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      validateToken(token);
    }
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const role = urlParams.get('role');
    const userId = urlParams.get('userId');
    const email = urlParams.get('email');
    const name = urlParams.get('name');
    const error = urlParams.get('error');

    if (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Errore durante l\'autenticazione con Google' });
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (token && role && userId && email && name) {
      const user: User = {
        id: parseInt(userId),
        email: decodeURIComponent(email),
        firstName: decodeURIComponent(name).split(' ')[0],
        lastName: decodeURIComponent(name).split(' ').slice(1).join(' '),
        role,
        provider: 'GOOGLE',
        emailVerified: true,
      };

      // Save token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user, token } 
      });

      // Clean URL and redirect based on role
      window.history.replaceState({}, document.title, window.location.pathname);
      redirectBasedOnRole(role);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valid && data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
          dispatch({ 
            type: 'AUTH_SUCCESS', 
            payload: { user: data.user, token } 
          });
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { token, user } = data.data;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user, token } 
        });

        // Redirect based on role
        redirectBasedOnRole(user.role);
      } else {
        dispatch({ 
          type: 'AUTH_ERROR', 
          payload: data.message || 'Errore durante il login' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: 'Errore di connessione. Riprova più tardi.' 
      });
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { token, user } = data.data;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user, token } 
        });

        // Redirect based on role
        redirectBasedOnRole(user.role);
      } else {
        dispatch({ 
          type: 'AUTH_ERROR', 
          payload: data.message || 'Errore durante la registrazione' 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: 'Errore di connessione. Riprova più tardi.' 
      });
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      dispatch({ type: 'LOGOUT' });
      window.location.href = '/auth';
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const redirectBasedOnRole = (role: string) => {
    switch (role.toUpperCase()) {
      case 'RESTAURANT_OWNER':
        window.location.href = '/dashboard/restaurant';
        break;
      case 'ADMIN':
        window.location.href = '/dashboard/admin';
        break;
      case 'CUSTOMER':
      default:
        window.location.href = '/dashboard';
        break;
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};