"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth, provider } from '../googleSignin/config';
import { signInWithPopup } from 'firebase/auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Logged with:', { email, password });
    };

    const handleGoogleLogin = () => {
        signInWithPopup(auth, provider)
            .then((data) => {
                console.log('Google Sign-In Success:', data.user.email);
                localStorage.setItem('email', data.user.email);
                localStorage.setItem('isLoggedIn', 'true'); // Set login status
                window.dispatchEvent(new Event('storage')); // Trigger global update
                router.push('/'); // Redirect to homepage
            })
            .catch((error) => {
                console.error('Google Sign-In Error:', error);
            });
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen w-full bg-[#111219]">
            <div
                className="absolute bottom-[200px] left-1/2 transform -translate-x-1/2 
                    w-[400px] h-[400px] bg-gradient-to-br from-orange-400 to-white 
                    filter blur-3xl opacity-70"
            ></div>
            <div className="relative z-10 p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-white text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-white block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-white block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            minLength="8"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-[#313131] w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                        Login
                    </button>
                </form>
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-white">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <button
                    onClick={handleGoogleLogin}
                    className="w-full mt-4 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                    <Image
                        src="/Google.png"
                        alt="Google Icon"
                        width={20}
                        height={20}
                        className="mr-2"
                    />
                    Login with Google
                </button>
            </div>
        </div>
    );
};
