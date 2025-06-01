import { getUser } from "@/auth/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Resume Booster AI",
  description: "AI-powered resume feedback tool for job seekers",
};

export default async function HomePage() {
  const user = await getUser();
  if (user) {
    redirect("/review");
  }

  return (
    <main className="h-screen overflow-hidden text-white flex items-center justify-center ">
      <section className="max-w-3xl text-center -translate-y-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
          Supercharge Your Job Hunt with{" "}
          <span className="text-indigo-500">AI</span>
        </h1>
        <p className="text-lg text-zinc-400 mb-8">
          Upload your resume and get instant, actionable feedback based on your
          dream job description. Improve your chances of passing Applicant
          Tracking Systems (ATS) and impress recruiters.
        </p>
        <Link
          href="/login"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition"
        >
          Get Started
        </Link>
        <p className="mt-4 text-sm text-zinc-500">
          No account? Creating one takes less than 30 seconds.
        </p>
      </section>
    </main>
  );
}
