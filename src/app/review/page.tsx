// app/review/page.tsx
import { getUser } from "@/auth/server";
import { redirect } from "next/navigation";
import ClientResumeTool from "@/components/ClientResumeTool";

export default async function ReviewPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login"); // or "/signin" or show an error page
  }
  return (
    <div className="flex h-full flex-col items-center gap-4 p-6">
      <ClientResumeTool />
    </div>
  );
}
