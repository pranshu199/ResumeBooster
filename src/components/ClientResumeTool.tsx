"use client";

import React, { useRef, useState } from "react";
import ResumeUpload from "@/components/ui/ResumeUpload";
import NoteTextInput from "@/components/ui/NoteTextInput";
import { askAIAboutResumeAction } from "@/actions/feedback";
import "@/styles/ai-response.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function ClientResumeTool() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const lastResumeText = useRef("");
  const lastJobDescription = useRef("");

  const handleSubmit = async () => {
    if (
      resumeText === lastResumeText.current &&
      jobDescription === lastJobDescription.current
    ) {
      toast("You've already analyzed this content.");
      return;
    }
    setLoading(true);
    try {
      const result = await askAIAboutResumeAction(resumeText, jobDescription);
      setReviewResult(result);
      setShowDialog(true);
      //  Update last submitted values
      lastResumeText.current = resumeText;
      lastJobDescription.current = jobDescription;
    } catch (err) {
      console.error("error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        <ResumeUpload onExtract={setResumeText} />
        <NoteTextInput value={jobDescription} onChange={setJobDescription} />
        {/* button + dialog */}
        <Button
          variant={"default"}
          onClick={handleSubmit}
          disabled={!resumeText || !jobDescription || loading}
          className="bg-blue-900 text-white w-full mt-1 ml-1 rounded hover:bg-blue-500 transition-colors "
        >
          {loading ? "Analyzing..." : "Get AI Feedback"}
        </Button>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-4xl overflow-hidden">
            <DialogHeader>
              <DialogTitle>ATS Analysis Result</DialogTitle>
            </DialogHeader>
            {reviewResult && (
              <div className="max-h-[70vh] overflow-y-auto px-1">
                <div
                  className="bot-response text-muted-foreground text-sm"
                  dangerouslySetInnerHTML={{ __html: reviewResult }}
                />
              </div>
            )}
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Close
                </button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
