"use client";

import { useState } from "react";
import { ImageInput } from "@/components/ui/image-input";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSendImage = async (file: File) => {
    setIsLoading(true);
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error uploading image:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
            Lightweight CNN based AI Farm Assistant
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Upload an image of your crop to detect diseases and get treatment recommendations
          </p>
        </div>

        {/* Chat-like Interface */}
        <div className="max-w-4xl mx-auto">
          {/* AI Assistant Message */}
          <div className="mb-6">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 max-w-md">
              <p className="text-gray-700 dark:text-gray-300">
                Hello! I'm your AI farm assistant. Take a photo of your crop leaf, or ask me about diseases.
              </p>
            </div>
          </div>

          {/* Response Area */}
          {response && (
            <div className="mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 max-w-2xl">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Analysis Result:
                </h3>
                <pre className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
                  {response}
                </pre>
              </div>
            </div>
          )}

          {/* Image Input Component */}
          <div className="flex justify-center">
            <ImageInput
              onSend={handleSendImage}
              isLoading={isLoading}
              placeholder="Upload an image to analyze..."
            />
          </div>
        </div>
      </main>
    </div>
  );
}
