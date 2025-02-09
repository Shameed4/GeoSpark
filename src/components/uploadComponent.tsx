"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function UploadButton() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("File uploaded successfully!");
      } else {
        setMessage("Upload failed.");
      }
    } catch (error) {
      setMessage("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".mp4,.mov,.m4v"
      />
      <button
        onClick={triggerFileInput}
        disabled={uploading}
        className="flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-xl 
                   bg-gradient-to-r from-white to-orange-500 
                   hover:from-orange-400 hover:to-orange-600
                   transition-colors transition-transform duration-300 ease-in-out 
                   hover:scale-105 active:scale-95 shadow-lg"
      >
        <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
          {uploading ? "Uploading..." : "Upload"}
        </span>
        <Image
          src={"/ai.png"}
          alt={"AI"}
          width={15}
          height={15}
          className="mb-1"
        />
      </button>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
