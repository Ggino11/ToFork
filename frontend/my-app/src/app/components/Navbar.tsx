'use client'

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle, FaSignOutAlt, FaUser } from "react-icons/fa";
import ProfileAvatar from "./ProfileAvatar";
import { usePathname, useRouter } from "next/navigation"; // Aggiunto useRouter
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, user, logout } = useAuth(); // Aggiunto logout

    // Stato per gestire l'apertura del menu a tendina
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Ref per rilevare i click fuori dal menu
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isRistoranti = pathname.startsWith('/ristoranti');
    const isHome = pathname === '/' || pathname === '';

    // Chiudi il menu se si clicca fuori
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        router.push('/'); // Reindirizza alla home
    };

    // Determina il link del profilo in base al ruolo
    const profileLink = user?.role === 'RESTAURANT_OWNER' ? "/restaurantDashboard" : "/profile";

    return (
        <nav className="fixed w-full z-50 bg-white shadow-md px-6 py-1 flex items-center">
            {/* Logo */}
            <Link href="/" className="">
                <Image src="/logo.svg" width={200} height={60} alt="ToFork logo" />
            </Link>

            <div className="flex items-center space-x-2 ml-auto">
                <div className="hidden md:flex items-center space-x-2">
                    <Link
                        href="/"
                        className={`rounded-2xl py-0.5 px-3 transition-colors ${
                            isHome
                                ? "bg-orange-500 text-white"
                                : "text-black hover:text-white hover:bg-orange-500"
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/ristoranti"
                        className={`rounded-2xl py-0.5 px-3 transition-colors ${
                            isRistoranti
                                ? "bg-orange-500 text-white"
                                : "text-black hover:text-white hover:bg-orange-500"
                        }`}
                    >
                        Ristoranti
                    </Link>
                </div>

                <div className="flex space-x-4 ml-8">
                    {isAuthenticated && user ? (
                        <div className="relative" ref={dropdownRef}>
                            {/* Bottone Avatar che apre/chiude il menu */}
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-2 text-black focus:outline-none"
                            >
                                <ProfileAvatar
                                    userName={user.firstName}
                                    userLastName={user.lastName}
                                    size={40}
                                />
                            </button>

                            {/* Menu a tendina (Dropdown) */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-bold text-gray-900 truncate">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>

                                    <Link
                                        href={profileLink}
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                    >
                                        <FaUser className="mr-2" /> Il tuo Profilo
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <FaSignOutAlt className="mr-2" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/auth"
                                className="flex items-center gap-2 px-4 py-2 rounded-3xl bg-logo text-white hover:bg-orange-700 transition"
                            >
                                <FaUserCircle /> Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}