// components/PDFTextExtractor.tsx
"use client";

import { useState } from "react";
import pdfToText from "react-pdftotext";

type ResumeUploadProps = {
  onExtract: (text: string) => void;
};

export default function ResumeUpload({ onExtract }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    pdfToText(file)
      .then((extractedFileText) => {
        onExtract(extractedFileText);
      })
      .catch((error) => {
        console.error("Error extracting text from PDF:", error);
        onExtract(""); // Clear text on error
      });
  };

  return (
    <div className="w-full ml-2 p-6 rounded-xl border border-zinc-700 bg-gradient-to-b from-green-900 to-green-950 text-white shadow-md">
      <label
        htmlFor="resumeUpload"
        className="block mb-4 text-lg font-semibold"
      >
        Upload Your Resume
      </label>
      <input
        id="resumeUpload"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold
               file:bg-blue-700 file:text-white hover:file:bg-blue-800
               text-sm text-zinc-200 bg-zinc-800 rounded w-full"
      />
      {file && (
        <p className="mt-3 text-sm text-green-400 italic">
          ✅ Selected: <span className="font-medium">{file.name}</span>
        </p>
      )}
    </div>
  );
}
