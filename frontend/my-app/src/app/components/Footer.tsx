import React from "react";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaTiktok, FaXTwitter } from "react-icons/fa6";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full mt-12">
      {/* Prima row */}
      <div className="bg-gray-200 px-6 py-8 flex flex-col md:flex-row md:justify-between md:items-start gap-8">
        {/* Logo e descrizione */}
        <div className="flex-1 mb-3 md:mb-0">
          <Link href="/" className="text-2xl font-bold text-logo">
            <Image
              src={"/Logo.svg"}
              alt="ToFork logo"
              width={150}
              height={50}
            />
          </Link>
          <span className="text-gray-900">
            Company # 49003, Registered with House of companies.
          </span>
        </div>
        <div className="flex-1 max-w-md flex flex-col items-start gap-4">
          {/* Newsletter */}
          <form className="w-full flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="La tua email"
              className="flex-1 px-4 py-2 rounded-lg border text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-logo"
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-logo text-white font-semibold hover:bg-orange-600 transition"
            >
              Iscriviti
            </button>
          </form>
          {/* Social sotto la newsletter */}
          <div className="flex flex-col items-center  w-full">
        
            <div className="flex gap-4 text-3xl">
              <Link
                href="https://instagram.com"
                target="_blank"
                aria-label="Instagram"
              >
                <FaInstagram className="hover:text-logo text-gray-900 transition" />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                aria-label="Facebook"
              >
                <FaFacebook className="hover:text-logo transition text-gray-900" />
              </Link>
              <Link
                href="https://tiktok.com"
                target="_blank"
                aria-label="TikTok"
              >
                <FaTiktok className="hover:text-logo transition text-gray-900" />
              </Link>
              <Link href="https://x.com" target="_blank" aria-label="X">
                <FaXTwitter className="hover:text-logo transition text-gray-900" />
              </Link>
            </div>
          </div>
        </div>
        {/* Important Links */}
        <div className="flex-1 flex-col items-start ml-auto gap-2 hidden md:flex">
          
          <span className="text-gray-500 mb-2 font-semibold">Important Links</span>
          <Link href="/help" className="hover:underline text-gray-700">
            Get Help
          </Link>
          <Link href="/signup" className="hover:underline text-gray-700">
            Signup
          </Link>
          <Link href="/register-restaurant" className="hover:underline text-gray-700">
            Registra il tuo ristorante
          </Link>
        
        </div>
      </div>

      {/* Seconda row*/}

      <div className="bg-gray-900 text-white px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
        <span className="font-extralight">
          &copy; {new Date().getFullYear()} Tofork. All Right Reserved.
        </span>
        <div className="flex gap-4">
          <span className="hover:underline">Termini di servizio</span>
          <span className="hover:underline">Privacy Policy</span>
          <span className="hover:underline">Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
}
