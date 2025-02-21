import Link from "next/link";
import { z } from "zod";
import { RegisterForm } from "./register-form";

export const RegisterComponent = () => {
  return (
    <div className="flex flex-col w-full px-[30%]">
      <div className="flex flex-col space-y-2 text-center ">
        <h1 className="text-2xl font-semibold tracking-tight ">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password below to create your account
        </p>
      </div>
      <RegisterForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};
