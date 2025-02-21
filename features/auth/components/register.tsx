"use client";
import Link from "next/link";
import { z } from "zod";
import { RegisterForm } from "./register-form";
import { useState } from "react";
import { RegisterSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateAccount } from "../api/use-create-account";
import { logger } from "@/lib/logger";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const log = logger.child({ module: "RegisterForm" });

export const RegisterComponent = () => {
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync } = useCreateAccount();

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const result = await mutateAsync(values);
      setSubmitSuccess(true);
      // router.push("/sign-in");
    } catch (error) {
      log.error(error);
      setSubmitError(error as Error);
    }
  };

  if (submitSuccess) {
    return (
      <div className="border-[1px] border-emerald-200 rounded-sm bg-emerald-50 p-2 text-muted-foreground mx-[30%]">
        <h1 className="font-semibold  text-center text-emerald-400">
          Account created
        </h1>
        <p className="text-emerald-300 ">
          Your account has been created. Please check your email to verify your
          account.{" "}
          <Link href={"/sign-in"} className="text-emerald-500">
            Click here to sign-in
          </Link>
        </p>
      </div>
    );
  }

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder="********"
                      type="password"
                    />
                  </FormControl>
                  <div className="w-full flex justify-between">
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 font-normal"
                      asChild
                    >
                      <Link href="/auth/reset">Forgot password?</Link>
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 font-normal"
                      asChild
                    >
                      <Link href="/auth/reset">Already has an account?</Link>
                    </Button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {submitError && (
            <FormMessage className="text-rose-500 font-semibold text-sm">
              {submitError.message}
            </FormMessage>
          )}

          <Button
            disabled={form.formState.isSubmitting || !form.formState.isValid}
            type="submit"
            className="w-full"
          >
            Create account
          </Button>
        </form>
      </Form>
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
