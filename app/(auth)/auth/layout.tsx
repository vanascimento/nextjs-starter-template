import Image from "next/image";
import Link from "next/link";
import React from "react";
import LoginCover from "@/assets/images/login_cover.png";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <div className="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white font-semibold dark:border-r lg:flex">
          <div className="absolute inset-0 bg-black opacity-80"></div>
          <Image
            src={LoginCover}
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
        <div className="w-full h-full flex flex-col justify-center items-center">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
