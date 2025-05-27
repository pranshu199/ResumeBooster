// components/PDFTextExtractor.tsx
"use client";

import { useState } from "react";
import pdfToText from "react-pdftotext";

type ResumeUploadProps = {
  onExtract: (text: string) => void;
};

export default function ResumeUpload({ onExtract }: ResumeUploadProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    pdfToText(file)
      .then((extractedFileText) => {
        setText(extractedFileText);
        onExtract(extractedFileText);
      })
      .catch((error) => {
        console.error("Error extracting text from PDF:", error);
        setText("");
        onExtract(""); // Clear text on error
      });
  };

  return (
    <div className="border border-zinc-700 p-6 rounded-xl bg-green-900 text-white w-full max-w-xl">
      <label className="block mb-4 font-medium text-lg">
        Upload your resume
      </label>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="bg-blue-800 p-2 rounded w-full text-sm"
      />
      {file && (
        <p className="mt-4 text-sm text-green-400">Selected: {file.name}</p>
      )}
    </div>
  );
}
