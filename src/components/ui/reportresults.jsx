"use client";
import { ChevronDown, Heart } from "lucide-react";
import { useState } from "react";
import Image from 'next/image';

export default function Reports() {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="w-full flex flex-col lg:flex-row min-h-screen">
      {/* Report */}
      <div className="lg:basis-[70%] flex-1 relative z-10">
        <div className="p-6"> {/* Location Name */}
          <button className="text-white flex items-center space-x-2 text-3xl font-light hover:text-white/90 transition-colors glass py-2 rounded-lg">
            <span>REPORT: Houston, TX</span>
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-12"> {/* Risk Assessment */}
          <section className="space-y-4">
            <h2 className="text-white text-2xl font-light">Risk Assessment</h2>
            <div className="glass p-6 space-y-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-white text-critical-light">Level: Critical</span>
              </div>
              <div className="space-y-2 text-white/70">
                <p>Other Info: Environmental impact assessment pending</p>
                <p>Other Info: Immediate action required</p>
                <p>Other Info: Local authorities notified</p>
                <p>Other Info: Monitoring systems active</p>
              </div>
            </div>
          </section>
        </div>

        <div className="p-6"> {/* Tips */}
          <section className="space-y-4">
            <h2 className="text-white text-2xl font-light">Advice</h2>
            <div className="glass p-6 space-y-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-white text-critical-light">Level: Critical</span>
              </div>
              <div className="space-y-2 text-white/70">
                <p>Other Info: Evacuate immediately if instructed</p>
                <p>Other Info: Follow local authority guidelines</p>
                <p>Other Info: Stay tuned to emergency broadcasts</p>
                <p>Other Info: Prepare emergency kit</p>
              </div>
            </div>
          </section>
        </div>

        <div className="p-4 mt-auto"> {/* Disclaimer */}
          <footer className="glass p-4 text-center text-sm text-white/50">
            <p className="max-w-2xl mx-auto">
              DISCLAIMER: This AI-generated content is for informational purposes only. While AI strives for accuracy, it can make mistakes. Always verify critical details from trusted sources before making decisions.
            </p>
          </footer>
        </div>
      </div>

      {/* Visual */}
      <div className="border-l border-gray-700 lg:basis-[30%] flex-1 relative lg:h-screen">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" /> {/* Upper black gradient */}
        
        <div className="relative h-full"> {/* Image, Heart, Description */}
          <Image
            src="/forest.jpg"
            alt="Forest landscape"
            className="object-cover"
            fill
            priority
          />
          
          <div className="absolute bottom-20 right-6 glass px-6 py-4 rounded-lg z-20">
            <h3 className="text-white text-2xl font-medium text-critical-light">Risk: CRITICAL</h3>
            <p className="text-sm text-white/70 mt-2 max-w-xs">
              AI generated description. AI generated description. AI generated description. AI generated description.
            </p>
          </div>

          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="absolute bottom-6 right-6 p-3 glass rounded-full hover:bg-white/10 transition-colors z-20"
          >
            <Heart 
              className={`w-6 h-6 transition-colors ${
                isLiked ? 'fill-red-500 text-red-500' : 'text-white/70'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
