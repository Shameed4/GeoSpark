"use-client"
import React from "react";
import Image from 'next/image';

export default function Account() {
  return (
    <div className="min-h-screen w-full text-white relative">
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-96 h-96 bg-white opacity-20 blur-3xl rounded-full z-0"></div>
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-bold">Hello User!</h1>
          <p className="text-gray-400">Account Settings</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg mb-8 relative z-10">
          <h2 className="text-xl font-bold mb-4">YOUR INFORMATION</h2>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-400">Name</span>
              <span className="text-white">First Last</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-400">Email</span>
              <span className="text-white">user@email.com</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-400">Location</span>
              <span className="text-white">Stony Brook, NY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Password</span>
              <span className="text-white">********</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Saved Reports</h2>
          <div className="grid grid-cols-2 gap-6 relative z-10">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <a
                  href={`#report-${index + 1}`}
                  key={index}
                  className="bg-gray-800 rounded-2xl p-4 shadow-lg flex items-center space-x-4 hover:bg-gray-700 transition-colors"
                >
                  <Image
                    src={'/CAplaceholder.png'}
                    alt="Report"
                    width={50}
                    height={50}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-bold">Los Angeles</h3>
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/Location.png"
                        alt="Location Pointer"
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                      <p className="text-gray-400">California</p>
                    </div>
                    <p className="text-red-500 font-bold">CRITICAL</p>
                  </div>
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
