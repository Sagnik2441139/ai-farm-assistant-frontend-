"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload, IconCamera, IconSend } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

interface ImageInputProps {
  onSend?: (file: File) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const ImageInput = ({
  onSend,
  isLoading = false,
  placeholder = "Type a message...",
}: ImageInputProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      // Check if file is an image
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        alert('Please select an image file');
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleSend = () => {
    if (selectedFile && onSend) {
      onSend(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    onDrop: handleFileChange,
    onDropRejected: (rejectedFiles) => {
      console.log('Rejected files:', rejectedFiles);
      alert('Please select a valid image file');
    },
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Image Preview */}
      {previewUrl && selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 relative"
        >
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Selected image"
              className="max-w-32 max-h-32 object-cover rounded-lg shadow-sm"
            />
            <button
              onClick={clearFile}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        </motion.div>
      )}

      {/* Input Field */}
      <div className="relative" {...getRootProps()}>
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-3 shadow-sm">
          {/* Camera Icon */}
          <button
            onClick={handleClick}
            className="flex-shrink-0 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            disabled={isLoading}
          >
            <IconCamera className="w-5 h-5" />
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
            className="hidden"
          />

          {/* Text Input */}
          <input
            type="text"
            placeholder={selectedFile ? `Image: ${selectedFile.name}` : placeholder}
            className="flex-1 px-3 py-1 bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
            disabled
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!selectedFile || isLoading}
            className={cn(
              "flex-shrink-0 p-2 rounded-full transition-all duration-200",
              selectedFile && !isLoading
                ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <IconSend className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Drag and Drop Overlay */}
        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-dashed border-blue-500 rounded-full flex items-center justify-center"
          >
            <div className="text-center">
              <IconUpload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-blue-500 font-medium">Drop your image here</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Click the camera icon or drag and drop an image to get started
      </p>
    </div>
  );
};