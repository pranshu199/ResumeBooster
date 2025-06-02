"use client";
import { useRouter } from "next/navigation";
import { CardContent, CardFooter } from "./card";
import { Input } from "./input";
import { Label } from "./label";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { loginAction, signUpAction } from "@/actions/users";

type Props = {
  type: "login" | "register";
};

function AuthForm({ type }: Props) {
  const isLoginForm = type === "login";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const rawEmail = formData.get("email") as string;
      const rawPassword = formData.get("password") as string;
      const rawName = formData.get("name") as string;

      if (
        typeof rawEmail !== "string" ||
        typeof rawPassword !== "string" ||
        (!isLoginForm && typeof rawName !== "string")
      ) {
        toast.error("Please fill all required fields.");
        return;
      }

      const email = rawEmail.trim().toLowerCase();
      const password = rawPassword.trim();
      const name = rawName?.trim();

      let errorMessage;
      let description;
      if (isLoginForm) {
        const result = await loginAction(email, password);
        errorMessage = result.errorMessage;
        description = "You have been succesfully logged in";
      } else {
        const result = await signUpAction(name, email, password);
        errorMessage = result.errorMessage;
        description = "Check your email for confirmation link";
      }
      if (!errorMessage) {
        toast.success(description);
        router.replace("/review");
      } else {
        toast.error(errorMessage);
      }
    });
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleSubmit(formData);
      }}
    >
      <CardContent className="grid w-full items-center gap-4">
        <Toaster richColors />
        {!isLoginForm && (
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="text"
              name="name"
              placeholder="Full Name"
              type="text"
              required
              disabled={isPending}
            />
          </div>
        )}
        <div className="flex flex-col space-y-1.5 ">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            required
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="Password"
            required
            disabled={isPending}
          />
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-6">
        <Button className="w-full mt-4">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>
        <p className="text-s">
          {isLoginForm
            ? "Don't have an account yet? "
            : "Already Have an account? "}
          <Link
            href={isLoginForm ? "/sign-up" : "/login"}
            className={`text-blue-500 underline ${isPending ? "pointer-events-none opacity-50" : ""}`}
          >
            {isLoginForm ? "Sign up" : "Login"}
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}

export default AuthForm;
