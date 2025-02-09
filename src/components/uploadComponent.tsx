"use client";

import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }
    
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

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg shadow-md max-w-sm mx-auto">
      <FileUpload />
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <button 
        onClick={handleUpload} 
        disabled={uploading} 
        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50">
        {uploading ? "Uploading..." : "Upload File"}
      </button>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
