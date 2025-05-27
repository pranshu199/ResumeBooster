import { getUser } from "@/auth/server";
import openai from "@/openai";
export const askAIAboutResumeAction = async (
  resumeText: string,
  jobDescription: string
) => {
  const user = await getUser();
  if (!user) throw new Error("You must be logged in to get resume feedback");

  if (!resumeText || !jobDescription) {
    return "<p>Please upload your resume and enter a job description to receive feedback.</p>";
  }

  const messages = [
    {
      role: "system" as const,
      content: `
        You are a professional career coach and hiring expert. 
        Your job is to review the user's resume in the context of the provided job description 
        and give concise, helpful, and actionable feedback.

        Response rules:
        - Be direct and clear.
        - Highlight gaps or missing keywords.
        - Suggest improvements in structure, relevance, or clarity.
        - Format in valid HTML: use <p>, <ul>, <li>, <strong>, <em>, <h2>, etc.
        - Do NOT use inline styles, JavaScript, or custom classes.
        - Assume the response will be rendered with dangerouslySetInnerHTML in React.
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

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    return (
      completion.choices[0].message.content ||
      "<p>There was a problem generating feedback.</p>"
    );
  } catch (error) {
    console.error("OpenAI error:", error);
    return "<p>There was an error generating your resume review.</p>";
  }
};
