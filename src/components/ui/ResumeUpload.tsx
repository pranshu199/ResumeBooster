"use client";

import { useState } from "react";
import pdfToText from "react-pdftotext";
import { UploadCloud } from "lucide-react";
import clsx from "clsx";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

type ResumeUploadProps = {
  onExtract: (text: string) => void;
};

export default function ResumeUpload({ onExtract }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = (fileList: FileList | null) => {
    const uploadedFile = fileList?.[0];
    if (!uploadedFile) return;

    if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(uploadedFile.type)
    ) {
      setError("Only PDF or Word documents are allowed.");
      return;
    }

    setError("");
    toast.success("File uploaded successfully!");
    setFile(uploadedFile);

    pdfToText(uploadedFile)
      .then((text) => onExtract(text))
      .catch((err) => {
        console.error("PDF extract error:", err);
        onExtract("");
        setError("Failed to extract text. Try another file.");
      });
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDrag = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  return (
    <div className="w-full h-40 p-6 rounded-xl border border-zinc-700 bg-blue-900 text-white shadow-lg">
      <label
        htmlFor="resumeUpload"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={clsx(
          "flex flex-col h-30 items-center justify-center text-center border-2 border-dashed rounded-lg px-6 py-12 cursor-pointer transition-colors duration-200",
          dragActive ? "border-blue-500 bg-green-800/40" : "border-zinc-500"
        )}
      >
        <UploadCloud className="w-10 h-10 mb-3 text-blue-200" />
        <p className="text-lg font-medium">
          Drag and drop your resume here, or{" "}
          <span className="">click to upload</span>
        </p>
        <input
          id="resumeUpload"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </label>

      {file && (
        <p className="mt-3 text-sm text-black-400 italic">
          ✅ Selected: <span className="font-medium">{file.name}</span>
        </p>
      )}
      {error && <p className="mt-2 text-sm text-red-400">⚠️ {error}</p>}
      <Toaster richColors />
    </div>
  );
}
