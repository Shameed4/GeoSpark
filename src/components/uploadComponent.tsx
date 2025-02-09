"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function UploadButton() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(""); // State for file name
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name); // Update file name state
      setMessage("");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleLatitudeChange = (e) => {
    setLatitude(e.target.value);
  };

  const handleLongitudeChange = (e) => {
    setLongitude(e.target.value);
  };

  const handleSubmit = async () => {
    if (!file || !latitude || !longitude) {
      setMessage("Please select a file and enter latitude and longitude.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("File and data uploaded successfully!");
      } else {
        setMessage("Upload failed.");
      }
    } catch (error) {
      setMessage("Error uploading file and data.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-black">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".mp4,.mov,.m4v"
      />
      <button
        onClick={triggerFileInput}
        className="flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-xl 
                   bg-gradient-to-r from-white to-orange-500 
                   hover:from-orange-400 hover:to-orange-600
                   transition-colors transition-transform duration-300 ease-in-out 
                   hover:scale-105 active:scale-95 shadow-lg"
      >
        <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">Upload File</span>
        <Image
          src={"/ai.png"}
          alt={"AI"}
          width={15}
          height={15}
          className="mb-1"
        />
      </button>

      {/* Show the file name if a file is selected */}
      {fileName && (
        <p className="mt-2 text-sm text-gray-700">Selected File: {fileName}</p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        <input
          type="number"
          placeholder="Latitude"
          value={latitude}
          onChange={handleLatitudeChange}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="number"
          placeholder="Longitude"
          value={longitude}
          onChange={handleLongitudeChange}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={uploading}
        className="mt-4 flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-xl 
                   bg-gradient-to-r from-white to-green-500 
                   hover:from-green-400 hover:to-green-600
                   transition-colors transition-transform duration-300 ease-in-out 
                   hover:scale-105 active:scale-95 shadow-lg"
      >
        <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
          {uploading ? "Uploading..." : "Submit"}
        </span>
      </button>

      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
