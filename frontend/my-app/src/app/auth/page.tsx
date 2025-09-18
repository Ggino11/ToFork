// app/auth/page.tsx
"use client";


import { useState, FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AuthLayout from './layout';
import Image from 'next/image'; 
import Link from 'next/link';


//  Icone SVG 
const UserIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const EmailIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const GoogleIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.37 1.62-4.38 1.62-3.82 0-6.94-3.1-6.94-6.94s3.12-6.94 6.94-6.94c2.2 0 3.58.88 4.42 1.66l2.62-2.62C18.03 2.46 15.53 1 12.48 1 5.88 1 1 5.88 1 12s4.88 11 11.48 11c3.2 0 5.73-1.08 7.64-3.02 1.96-1.96 2.58-4.9 2.58-7.26 0-.8-.08-1.28-.18-1.82H12.48z" />
    </svg>
);


// --- Schemi di validazione con Zod ---
const signupSchema = z.object({
  firstName: z.string().min(2, { message: "Il nome deve contenere almeno 2 caratteri" }),
  lastName: z.string().min(2, { message: "Il cognome deve contenere almeno 2 caratteri" }),
  email: z.string().email({ message: "Inserisci un'email valida" }),
  password: z.string().min(8, { message: "La password deve contenere almeno 8 caratteri" }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Inserisci un'email valida" }),
  password: z.string().min(1, { message: "La password è richiesta" }),
});

// --- Tipi derivati dagli schemi ---
type SignupFormValues = z.infer<typeof signupSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

// --- Funzioni di chiamata API ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function handleApiRequest(endpoint: string, data: any) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Errore ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Errore durante la chiamata a ${endpoint}:`, error);
        throw error;
    }
}

// --- Componente Principale ---
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const currentSchema = isLogin ? loginSchema : signupSchema;
  type CurrentFormValues = z.infer<typeof currentSchema>;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CurrentFormValues>({
    resolver: zodResolver(currentSchema),
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    reset();
    setApiError(null);
    setApiSuccess(null);
  };

  const onSubmit: SubmitHandler<CurrentFormValues> = async (data) => {
    setLoading(true);
    setApiError(null);
    setApiSuccess(null);

    const endpoint = isLogin ? '/auth/login' : '/auth/register';

    try {
      const result = await handleApiRequest(endpoint, data);
      setApiSuccess(isLogin ? 'Login effettuato con successo!' : 'Registrazione completata! Effettua il login.');
      console.log('Successo:', result);
      if(!isLogin) {
        toggleForm(); // Passa al login dopo la registrazione
      }
      // Qui potresti reindirizzare l'utente o salvare il token
    } catch (error: any) {
      setApiError(error.message || 'Si è verificato un errore inatteso.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = () => {
    // Reindirizza l'utente all'endpoint di autenticazione Google del backend
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 bg-cover bg-center" style={{  backgroundImage:
       "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')",
}}>
      <div className="w-full max-w-md bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg p-8 space-y-6">
      <div className="hidden md:flex items-center justify-center gap-4 mb-2">
        <button
          type="button"
          aria-label="Torna indietro"
          onClick={() => window.history.back()}
          className="p-2 rounded-full hover:bg-gray-700 transition"
        >
          {/* Freccia indietro SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <Link href="/" className="">
          <Image src="/logo.svg" width={200} height={60} alt="ToFork logo" />
        </Link>
      </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold">{isLogin ? 'Accedi al tuo account' : 'Crea un nuovo account'}</h1>
          <p className="text-gray-400 mt-2">
            {isLogin ? "Ben tornato! Inserisci le tue credenziali." : "Unisciti a noi! Bastano pochi secondi."}
          </p>
        </div>

        {apiError && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">{apiError}</div>}
        {apiSuccess && <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-center">{apiSuccess}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300" htmlFor="firstName">Nome</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="firstName"
                    type="text"
                    {...register('firstName' as any)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 pl-10 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Mario"
                  />
                </div>
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{(errors.firstName as any).message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300" htmlFor="lastName">Cognome</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="lastName"
                    type="text"
                    {...register('lastName' as any)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 pl-10 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Rossi"
                  />
                </div>
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{(errors.lastName as any).message}</p>}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-300" htmlFor="email">Email</label>
            <div className="relative">
              <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                {...register('email')}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 pl-10 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="nome@dominio.com"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300" htmlFor="password">Password</label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                type="password"
                {...register('password')}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 pl-10 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition disabled:bg-orange-800 disabled:cursor-not-allowed"
          >
            {loading ? 'Caricamento...' : (isLogin ? 'Accedi' : 'Crea account')}
          </button>
        </form>

        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">Oppure continua con</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 text-white bg-gray-700 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition"
        >
          <GoogleIcon className="w-5 h-5" />
          Google
        </button>

        <p className="text-sm text-center text-gray-400">
          {isLogin ? "Non hai un account?" : "Hai già un account?"}
          <button onClick={toggleForm} className="font-medium text-orange-500 hover:underline ml-1">
            {isLogin ? 'Registrati' : 'Accedi'}
          </button>
        </p>
      </div>
    </div>
  );
};

AuthPage.getLayout = function getLayout(page: React.ReactNode) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default AuthPage;
