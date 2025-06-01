"use server";

import { getUser } from "@/auth/server";
import openai from "@/lib/openai"; // make sure this exists

export const askAIAboutResumeAction = async (
  resumeText: string,
  jobDescription: string
) => {
  const user = await getUser();
  if (!user) {
    throw new Error("You must be logged in to get resume feedback");
  }

  if (!resumeText || !jobDescription) {
    return "<p>Please upload your resume and enter a job description to receive feedback.</p>";
  }

  const messages = [
    {
      role: "system" as const,
      content: `
       You are an expert in resume screening, career coaching, and applicant tracking systems (ATS).

        You are given:
        - A candidate's resume (text format)
        - A job description

        Your job is to:
        1. Compare the resume directly to the job description.
        2. Identify important keywords/skills that are missing from the resume.
        3. Provide direct suggestions on what the candidate should add, fix, or improve.
        4. Assign a strict **ATS match score out of 100** based on keyword match, relevance, and clarity.
        5. Format the output as **clean, structured HTML only**. No markdown, no inline styles, no explanations outside HTML.

        ### HTML Format (follow this strictly):
        <h2>ATS Match Score: XX/100</h2>

        <h3>Missing Keywords</h3>
        <ul>
          <li>[Keyword 1]</li>
          <li>[Keyword 2]</li>
          ...
        </ul>

        <h3>Resume Improvement Suggestions</h3>
        <ul>
          <li>[What to improve or add]</li>
          <li>[What section lacks detail]</li>
        </ul>

        <h3>Final Notes</h3>
        <p>Short summary of the resume quality and whether it would pass ATS filters or not.</p>

        ### Rules:
        - Be strict. Do not inflate the score. An average resume should score 60–70.
        - Prioritize **relevance to job description**, not overall resume quality.
        - Output must be valid HTML. No extra explanations outside tags.
        - Do NOT include greetings or "Sure, here's..." phrases.
        - Assume your output will be rendered directly in a web app using dangerouslySetInnerHTML in React.

        Resume:
      `.trim(),
    },
    {
      role: "user" as const,
      content: `
        Resume:
        ${resumeText}

        Job Description:
        ${jobDescription}
      `.trim(),
    },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  return (
    completion.choices[0].message.content ||
    "<p>There was a problem generating feedback.</p>"
  );
};
