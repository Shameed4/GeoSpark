"use client"
import { Inter, ABeeZee, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Nav from "@/components/nav";
import { ChevronRight, Search, Lightbulb, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const isUserLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(isUserLoggedIn);
    };

    // Initial check when the component mounts
    checkLoginStatus();

    // Listen for storage changes globally
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('email'); // Clear email from localStorage
    localStorage.setItem('isLoggedIn', 'false'); // Update login status
    setIsLoggedIn(false); // Update state to logged out
    router.push('/'); // Redirect to homepage
    console.log("User successfully logged out.");
  };

  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-[#0E1018]`}
      >
        <div className="flex min-h-[100vh]">
          <div className="flex flex-col p-10 gap-7 w-80 border-r-neutral-800 border-r-[1px]">
            <div className="flex items-center">
              <Image
                className="mr-2"
                src="/Logo.png"
                alt="logo"
                width={60}
                height={60}
              />
              <h1 className="text-2xl text-neutral-300 font-bold">LIT</h1>
            </div>
            <Nav />
            {!isLoggedIn && (
              <div className="flex flex-col items-center space-y-4 w-full">
                <Link
                  href="/login"
                  className="w-full block py-3 rounded-lg bg-neutral-800 text-white text-lg font-medium text-center shadow-md hover:bg-neutral-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full block py-3 rounded-lg bg-white text-black text-lg font-medium text-center shadow-md hover:bg-gray-100 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
            {isLoggedIn && (
              <div>
                <Link href="/account" className="p-2 bg-[#29292C] rounded-sm flex items-center hover:bg-[#38383B] transition-colors">
                  <div className="bg-gradient-to-t from-transparent to-white rounded-full w-14 h-14 border-white border-solid border-2 mr-2"></div>
                  <div>
                    <h3 className="text-white text-lg">My Account</h3>
                    <div className="flex items-center text-neutral-400">
                      View Account <ChevronRight size={18} />
                    </div>
                  </div>
                </Link>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-white hover:text-red-500 transition-colors"
                  >
                    <LogOut className="w-6 h-6" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
