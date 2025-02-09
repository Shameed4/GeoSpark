"use client";

import { ChevronDown, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getPlaceName } from "@/app/utils";

export default function Reports() {
  const [report, setReport] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const params = useParams();
  const { id } = params; // Extracting the 'id' from params

  useEffect(() => {
    if (!id) return; // Prevent fetching if id is undefined

    async function fetchReports() {
      try {
        console.log(`Fetching: http://127.0.0.1:5000/api/all-data?coords=${id}`);
        const response = await fetch(`http://127.0.0.1:5000/api/all-data?coords=${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        // console.log("Getting place name");
        // console.log(await getPlaceName(id));
        // console.log(data);
        data = JSON.parse(JSON.stringify(data));
        setReport(data ? data["34.0522,-118.2437"] : {});
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    }

    fetchReports();
  }, [id]); // Depend on id


  console.log(`report is ${JSON.stringify(report)}`);
  // console.log(`Place name - ${report['placeName']}`)
  return (
    <div className="w-full flex flex-col lg:flex-row min-h-screen">
      {report ? (
        <div className="lg:basis-[70%] flex-1 relative z-10">
          <div className="p-6">
            <button className="text-white flex items-center space-x-2 text-3xl font-light hover:text-white/90 transition-colors glass py-2 rounded-lg">
              <span>REPORT: abc</span>
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-12">
            <section className="space-y-4">
              <h2 className="text-white text-2xl font-light">Risk Assessment</h2>
              <div className="glass p-6 space-y-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-white text-critical-light">Level: {report["risk"]}</span>
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

          <div className="p-6">
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

          <div className="p-4 mt-auto">
            <footer className="glass p-4 text-center text-sm text-white/50">
              <p className="max-w-2xl mx-auto">
                DISCLAIMER: This AI-generated content is for informational purposes only. While AI strives for accuracy, it can make mistakes. Always verify critical details from trusted sources before making decisions.
              </p>
            </footer>
          </div>
        </div>
      ) : (
        <div className="w-full text-center text-white p-6">Loading...</div>
      )}

      <div className="border-l border-gray-700 lg:basis-[30%] flex-1 relative lg:h-screen">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />

        <div className="relative h-full">
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
              className={`w-6 h-6 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-white/70'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
