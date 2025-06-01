"use client";

import { useEffect, ChangeEvent, useState, useRef } from "react";
import { Textarea } from "./textarea";
import { toast } from "sonner";
import { debounceTimeout } from "@/lib/constants";

type NoteTextInputProps = {
  value: string;
  onChange: (value: string) => void;
};
let updateTimeout: NodeJS.Timeout;

function NoteTextInput({ value, onChange }: NoteTextInputProps) {
  //  Keep job Description Text in sync
  const [jobDescription, setJobDescription] = useState("");
  const jdRef = useRef<HTMLTextAreaElement>(null);

  const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.currentTarget.value;

    setJobDescription(newText);

    clearTimeout(updateTimeout);

    updateTimeout = setTimeout(() => {
      toast.success(" Job Description saved");
    }, debounceTimeout);
    onChange(newText);
  };

  return (
    <Textarea
      ref={jdRef}
      value={jobDescription}
      onChange={handleUpdateNote}
      placeholder="Type / Paste the Job Description here..."
      className="scrollbar-hidden placeholder:text-muted-foreground m-2 mb-4 min-h-[350px] h-auto max-h-[450px]  w-full resize-none border p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  );
}

export default NoteTextInput;
