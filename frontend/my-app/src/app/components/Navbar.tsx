
'use client'

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import ProfileAvatar from "./ProfileAvatar"; // 
import {usePathname} from "next/navigation";

export interface User {
  name: string;
  lastName: string;
  email: string;
  // other user properties
}

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  return (
    <nav className=" fixed w-full bg-white shadow-md px-6 py-1 flex items-center">
      {/* Logo */}
      <Link href="/" className="">
        <Image src="/Logo.svg" width={200} height={60} alt="ToFork logo" />
      </Link>

      <div className="flex items-center space-x-2 ml-auto">
      <div className="hidden md:flex items-center space-x-2">

      <Link
        href="/"
        className={`rounded-2xl py-0.5 px-3 ${
          pathname === "/" ? "bg-orange-500 text-white" : "text-black hover:text-white hover:bg-orange-500 transition"
        }`}
      >
        Home
      </Link>
        <Link
          href="/ristoranti"
          className="hover:text-white hover:bg-orange-500 transition 
          text-black rounded-2xl py-0.5 px-3"
        >
          Ristoranti
        </Link>
      </div>
        <div className="flex space-x-4 ml-8">
          {user ? (
            <Link
              href="/profile"
              className="flex items-center space-x-2 text-black"
            >
             <ProfileAvatar userName={user.name} userLastName={user.lastName} size={40} />
              {/* Da rimuovere display solo avatar */}
              {/* <span className="hidden md:inline text-orange-500 font-medium">
                {user.name}
              </span> */}
            </Link>
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
