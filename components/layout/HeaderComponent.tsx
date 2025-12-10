"use client";

import Link from "next/link";
import { useState } from "react";

export default function HeaderComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed header px-4 lg:px-6 h-16 w-full flex items-center border-b bg-white shadow-md z-50">
      <Link className="flex items-center justify-center" href="/">
        <div className="text-[30px] text-transparent bg-clip-text bg-linear-to-r tracking-[-1px] from-red-500 to-purple-900 font-poppins font-bold flex flex-row items-center justify-center gap-1">
         OpenSound
        </div>
      </Link>
      <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
        <Link
          className="relative text-sm font-poppins font-bold text-[#6b6b6b] transition-colors duration-300 ease-in-out hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r from-red-500 to-purple-900"
          href="/"
        >
          Accueil
        </Link>
        <Link
          className="relative text-sm font-poppins font-bold text-[#6b6b6b] transition-colors duration-300 ease-in-out hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r from-red-500 to-purple-900"
          href="/dashboard"
        >
          Tableau de bord
        </Link>
        <Link
          className="relative text-sm font-poppins font-bold text-[#6b6b6b] transition-colors duration-300 ease-in-out hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r from-red-500 to-purple-900"
          href="/admin"
        >
          Admin
        </Link>
        <Link
          className="relative text-sm font-poppins font-bold text-[#6b6b6b] transition-colors duration-300 ease-in-out hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r from-red-500 to-purple-900"
          href="/about"
        >
          À propos
        </Link>
      </nav>
      <button
        className="ml-auto md:hidden flex items-center"
        onClick={toggleMenu}
      >
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>
      <div
        className={`fixed top-0 left-0 h-full w-full bg-white shadow-md transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <button className="absolute top-4 right-4" onClick={toggleMenu}>
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <nav className="mt-16 flex flex-col gap-4 p-4">
          <Link
            className="relative text-sm font-poppins font-bold text-[#6b6b6b] transition-colors duration-300 ease-in-out hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r from-[#98ff87] to-[#3d96ff]"
            href="/"
            onClick={toggleMenu}
          >
            Accueil
          </Link>
          <Link
            className="relative text-sm font-poppins font-bold text-[#6b6b6b] transition-colors duration-300 ease-in-out hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r from-red-500 to-purple-900"
            href="/dashboard"
            onClick={toggleMenu}
          >
            Tableau de bord
          </Link>
          <Link
            className="relative text-sm font-poppins font-bold text-[#6b6b6b] transition-colors duration-300 ease-in-out hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r from-red-500 to-purple-900"
            href="/api-docs"
            onClick={toggleMenu}
          >
            API
          </Link>
          <Link
            className="relative text-sm font-poppins font-bold text-[#6b6b6b] transition-colors duration-300 ease-in-out hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r from-red-500 to-purple-900"
            href="/about"
            onClick={toggleMenu}
          >
            À propos
          </Link>
        </nav>
      </div>
    </header>
  );
}