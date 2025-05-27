"use client";

import { getUser } from "@/auth/server";
import NoteTextInput from "@/components/ui/NoteTextInput";
import ResumeUpload from "@/components/ui/ResumeUpload";
import React, { useEffect, useState } from "react";

function HomePage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [reviewResult, setReviewResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    // setLoading(true);
    // try {
    //   const response = await fetch("/api/review", {
    //     method: "POST",
    //     body: JSON.stringify({ resumeText, jobDescription }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    //   const result = await response.json();
    //   setReviewResult(result);
    // } catch (err) {
    //   console.error("Failed to get review:", err);
    // } finally {
    //   setLoading(false);
    // }
    useEffect(() => {}, [jobDescription, resumeText]);
  };
  return (
    <div className="flex h-full flex-col items-center gap-4 p-6">
      <ResumeUpload
        onExtract={(text) => {
          console.log("Extracted text:", text);
          setResumeText(text);
        }}
      />
      <NoteTextInput value={jobDescription} onChange={setJobDescription} />
      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
        disabled={!resumeText || !jobDescription || loading}
      >
        {loading ? "Analyzing..." : "Get AI Feedback"}
      </button>

      {reviewResult && (
        <div className="mt-4 w-full max-w-3xl bg-zinc-800 text-white p-4 rounded-xl">
          <h3 className="text-lg font-bold">Review Result</h3>
          <pre className="mt-2 whitespace-pre-wrap text-sm">
            {JSON.stringify(reviewResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default HomePage;
