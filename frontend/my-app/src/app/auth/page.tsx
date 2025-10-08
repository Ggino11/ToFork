"use client";

import { useState, FC, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image'; 
import Link from 'next/link';
import { useAuth } from '../context/AuthContext'; // 1. Importiamo il context

// --- Icone SVG ---
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
const RestaurantIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A.75.75 0 0114.25 12h.5a.75.75 0 01.75.75V21m-4.5 0v-7.5A.75.75 0 0110.5 12h.5a.75.75 0 01.75.75V21m-4.5 0H5.625c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125H9M15 9.75v3.75m-1.5-6.75v8.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" />
    </svg>
);
const LocationIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);

// --- Schemi di validazione Zod ---
const loginSchema = z.object({
  email: z.string().email({ message: "Inserisci un'email valida" }),
  password: z.string().min(1, { message: "La password è richiesta" }),
});

const signupUserSchema = z.object({
  firstName: z.string().min(2, { message: "Il nome deve contenere almeno 2 caratteri" }),
  lastName: z.string().min(2, { message: "Il cognome deve contenere almeno 2 caratteri" }),
  email: z.string().email({ message: "Inserisci un'email valida" }),
  password: z.string().min(8, { message: "La password deve contenere almeno 8 caratteri" }),
});

const signupRestaurantSchema = z.object({
    restaurantName: z.string().min(3, { message: "Il nome del ristorante deve avere almeno 3 caratteri" }),
    address: z.string().min(5, { message: "L'indirizzo deve avere almeno 5 caratteri" }),
    adminFirstName: z.string().min(2, { message: "Il nome deve contenere almeno 2 caratteri" }),
    adminLastName: z.string().min(2, { message: "Il cognome deve contenere almeno 2 caratteri" }),
    email: z.string().email({ message: "Inserisci un'email valida" }),
    password: z.string().min(8, { message: "La password deve contenere almeno 8 caratteri" }),
});

// --- Tipi dei Form ---
type LoginFormValues = z.infer<typeof loginSchema>;
type SignupUserFormValues = z.infer<typeof signupUserSchema>;
type SignupRestaurantFormValues = z.infer<typeof signupRestaurantSchema>;
type FormValues = LoginFormValues | SignupUserFormValues | SignupRestaurantFormValues;

// --- Componente Principale ---
const AuthPage = () => {
  const [formMode, setFormMode] = useState<'login' | 'signupUser' | 'signupRestaurant'>('login');
  
  // 2. Usiamo stato e funzioni dal nostro AuthContext
  const { login, register, registerRestaurant, isLoading, error, clearError } = useAuth();
  
  // Stato locale solo per i messaggi di successo
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  // Determina lo schema di validazione corrente
  const currentSchema = useMemo(() => {
    switch (formMode) {
      case 'login': return loginSchema;
      case 'signupUser': return signupUserSchema;
      case 'signupRestaurant': return signupRestaurantSchema;
    }
  }, [formMode]);

  const { register: formRegister, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(currentSchema),
  });

  // Funzione per cambiare il tipo di form
  const switchFormMode = (mode: 'login' | 'signupUser' | 'signupRestaurant') => {
    setFormMode(mode);
    reset();
    clearError();
    setApiSuccess(null);
  };

  // 3. La funzione onSubmit ora usa le funzioni del context
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setApiSuccess(null);
    clearError();
    let success = false;

    switch (formMode) {
        case 'login':
            await login(data.email as string, data.password as string);
            // Il redirect dopo il login è gestito automaticamente dal context
            return;
        case 'signupUser':
            success = await register(data as SignupUserFormValues);
            if (success) {
                setApiSuccess('Registrazione completata! Ora puoi effettuare il login.');
                switchFormMode('login'); 
            }
            break;
        case 'signupRestaurant':
            success = await registerRestaurant(data as SignupRestaurantFormValues);
            if (success) {
                setApiSuccess('Registrazione ristorante completata! Ora puoi effettuare il login.');
                switchFormMode('login');
            }
            break;
    }
  };
  
  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/oauth2/authorization/google`;
  };
  
  // Contenuto dinamico per titoli e pulsanti
  const { title, subtitle, buttonText } = useMemo(() => {
    switch (formMode) {
      case 'login':
        return { title: 'Accedi al tuo account', subtitle: 'Ben tornato! Inserisci le tue credenziali.', buttonText: 'Accedi' };
      case 'signupUser':
        return { title: 'Crea un nuovo account', subtitle: 'Unisciti a noi! Bastano pochi secondi.', buttonText: 'Crea account' };
      case 'signupRestaurant':
        return { title: 'Registra il tuo ristorante', subtitle: 'Entra a far parte del nostro network.', buttonText: 'Registra ristorante' };
    }
  }, [formMode]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')" }}>
      <div className="w-full max-w-md bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg p-8 space-y-6">
        <div className="hidden md:flex items-center justify-center gap-4 mb-2">
            <button type="button" aria-label="Torna indietro" onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-gray-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <Link href="/"><Image src="/logo.svg" width={200} height={60} alt="ToFork logo" /></Link>
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-gray-400 mt-2">{subtitle}</p>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">{error}</div>}
        {apiSuccess && <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-center">{apiSuccess}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {formMode === 'signupUser' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300" htmlFor="firstName">Nome</label>
                <div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-12 h-5 w-5 text-gray-400" /><input id="firstName" type="text" {...formRegister('firstName')} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 pl-10 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Mario"/></div>
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{(errors.firstName as any).message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300" htmlFor="lastName">Cognome</label>
                <div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-12 h-5 w-5 text-gray-400" /><input id="lastName" type="text" {...formRegister('lastName')} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 pl-10 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Rossi"/></div>
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{(errors.lastName as any).message}</p>}
              </div>
            </div>
          )}

          {formMode === 'signupRestaurant' && (
            <>
                <div>
                    <label className="text-sm font-medium text-gray-300" htmlFor="restaurantName">Nome Ristorante</label>
                    <div className="relative"><RestaurantIcon className="absolute left-3 top-1/2 -translate-y-12 h-5 w-5 text-gray-400" /><input id="restaurantName" type="text" {...formRegister('restaurantName')} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 pl-10" placeholder="Ristorante La Brace"/></div>
                    {errors.restaurantName && <p className="text-red-400 text-xs mt-1">{(errors.restaurantName as any).message}</p>}
                </div>
                 <div>
                    <label className="text-sm font-medium text-gray-300" htmlFor="address">Indirizzo</label>
                    <div className="relative"><LocationIcon className="absolute left-3 top-1/2 -translate-y-12 h-5 w-5 text-gray-400" /><input id="address" type="text" {...formRegister('address')} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 pl-10" placeholder="Via Roma, 1, Milano"/></div>
                    {errors.address && <p className="text-red-400 text-xs mt-1">{(errors.address as any).message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-300" htmlFor="adminFirstName">Nome Admin</label>
                        <div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-12 h-5 w-5 text-gray-400" /><input id="adminFirstName" type="text" {...formRegister('adminFirstName')} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 pl-10" placeholder="Luigi"/></div>
                        {errors.adminFirstName && <p className="text-red-400 text-xs mt-1">{(errors.adminFirstName as any).message}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300" htmlFor="adminLastName">Cognome Admin</label>
                        <div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-12 h-5 w-5 text-gray-400" /><input id="adminLastName" type="text" {...formRegister('adminLastName')} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 pl-10" placeholder="Verdi"/></div>
                        {errors.adminLastName && <p className="text-red-400 text-xs mt-1">{(errors.adminLastName as any).message}</p>}
                    </div>
                </div>
            </>
          )}

          <div>
            <label className="text-sm font-medium text-gray-300" htmlFor="email">Email</label>
            <div className="relative"><EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input id="email" type="email" {...formRegister('email')} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 pl-10" placeholder="nome@dominio.com"/></div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300" htmlFor="password">Password</label>
            <div className="relative"><LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input id="password" type="password" {...formRegister('password')} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 pl-10" placeholder="••••••••"/></div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isLoading} className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition disabled:bg-orange-800 disabled:cursor-not-allowed">
            {isLoading ? 'Caricamento...' : buttonText}
          </button>
        </form>

        <div className="relative flex items-center"><div className="flex-grow border-t border-gray-600"></div><span className="flex-shrink mx-4 text-gray-400 text-sm">Oppure</span><div className="flex-grow border-t border-gray-600"></div></div>

        <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2 text-white bg-gray-700 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition">
          <GoogleIcon className="w-5 h-5" /> Continua con Google
        </button>

        <div className='space-y-2 text-sm text-center text-gray-400'>
            {formMode === 'login' && <p>Non hai un account? <button onClick={() => switchFormMode('signupUser')} className="font-medium text-orange-500 hover:underline ml-1">Registrati</button></p>}
            {formMode === 'signupUser' && <p>Hai già un account? <button onClick={() => switchFormMode('login')} className="font-medium text-orange-500 hover:underline ml-1">Accedi</button></p>}
            {formMode === 'signupRestaurant' && <p>Hai già un account ristoratore? <button onClick={() => switchFormMode('login')} className="font-medium text-orange-500 hover:underline ml-1">Accedi</button></p>}
            
            <div className="border-t border-gray-700 my-2"></div>
            
            {formMode !== 'signupRestaurant' && <p>Sei un ristoratore? <button onClick={() => switchFormMode('signupRestaurant')} className="font-medium text-orange-500 hover:underline ml-1">Registra il tuo locale</button></p>}
            {formMode === 'signupRestaurant' && <p>Sei un cliente? <button onClick={() => switchFormMode('signupUser')} className="font-medium text-orange-500 hover:underline ml-1">Crea un account utente</button></p>}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

