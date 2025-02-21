import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { RegisterComponent } from "@/features/auth/components/register";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <div className="h-full">
      <div className="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/examples/authentication"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white font-semibold dark:border-r lg:flex">
          <div className="absolute inset-0 bg-black opacity-80"></div>
          <Image
            src="/cover.png"
            alt="Image"
            layout="fill"
            priority
            style={{ objectFit: "cover" }}
            className="brightness-[0.4] "
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Starter Template
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Simplicity is the ultimate sophistication. Nature is full
                of simple reasons that work perfectly. Those who wish to create
                must seek the essence and remove the superfluous, for perfection
                is not when there is nothing left to add, but when there is
                nothing left to remove..&rdquo;
              </p>
              <footer className="text-sm">Leonardo DaVinci</footer>
            </blockquote>
          </div>
        </div>
        <div className="w-full h-full flex flex-col justify-center">
          <RegisterComponent />
        </div>
      </div>
    </div>
  );
}
