import Image from "next/image";
import Link from "next/link";
import { shadow } from "@/styles/utils";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "./DarkModeToggle";
import { getUser } from "@/auth/server";
import LogOutButton from "./LogOutButton";

async function Header() {
  const user = await getUser();

  return (
    <header
      className="bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{ boxShadow: shadow }}
    >
      <Link href="/" className="flex items-end gap-2">
        <Image
          src="/resumeBooster.png"
          className="rounded-full"
          alt="logo"
          height={60}
          width={60}
        />
        <h1 className="flex flex-col pb-1 text-2xl font-semibold leading-6">
          Resume
          <span>Booster</span>
        </h1>
      </Link>
      <div className="flex gap-4">
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <Button asChild variant="outline">
              <Link href="/sign-up" className="hidden sm:block">
                Sign Up
              </Link>
            </Button>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}

export default Header;
